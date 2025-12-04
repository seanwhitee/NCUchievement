import base64
import json
import os
import uuid
from datetime import datetime
from token import TokenData, decode_token, get_token_from_cookies

import boto3

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")


def lambda_handler(event: dict, context) -> dict:
    """
    API Gateway handler for endpoint /badge/{badge_id}/submission
    """

    badge_id = event["pathParameters"]["badge_id"]
    http_method = event["httpMethod"]

    if http_method == "POST":
        return handle_post(event, badge_id)

    return {"statusCode": 405, "body": json.dumps({"message": "Method Not Allowed"})}


def handle_post(event: dict, badge_id: str) -> dict:
    """
    POST:
    Request body: {
        description: str,
        file: str, (base64:)
    }
    Response: {
        submission_id: str,
        user_id: str,
        reviewer: int, (Count of reviewers)
        badge_id: str,
        file: str, (S3 url)
        description: str
    }
    """

    # Check badge_id exists
    badge_table = dynamodb.Table(os.environ["BADGE_TABLE_NAME"])
    badge_response = badge_table.get_item(Key={"badge_id": badge_id})
    if "Item" not in badge_response:
        return {"statusCode": 404, "body": json.dumps({"message": "Badge not found"})}

    # Check login status
    cookies = event.get("headers", {}).get("Cookie", "")
    token = get_token_from_cookies(cookies)
    if not token:
        return {"statusCode": 401, "body": json.dumps({"message": "Unauthorized"})}

    try:
        secret_key = os.environ["JWT_SECRET"]
        algorithms = os.environ["JWT_ALGORITHMS"].split(",")
        token_data: TokenData = decode_token(token, secret_key, "HS256")
    except ValueError as e:
        return {"statusCode": 401, "body": json.dumps({"message": str(e)})}

    body = json.loads(event.get("body", "{}"))
    description = body.get("description", "")
    file_data = body.get("file", "")  # Object URL, data:image/png;base64,....

    if file_data:
        file_content_type = file_data[5 : file_data.index(";")]
        file_extension = file_content_type.split("/")[1]
        file_bytes = base64.b64decode(file_data.split(",")[1])
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        s3_key = (
            f"submissions/{badge_id}/{token_data['id']}_{timestamp}.{file_extension}"
        )

        # Upload to S3
        s3.put_object(
            Bucket="ncuchievement-submission-upload",
            Key=s3_key,
            Body=file_bytes,
            ContentType=file_content_type,
        )

    dynamodb_table = dynamodb.Table("submissions")
    submission_id = str(uuid.uuid4())

    dynamodb_table.put_item(
        Item={
            "submission_id": submission_id,
            "user_id": token_data["id"],
            "badge_id": badge_id,
            "file": f"s3://ncuchievement-submission-upload/{s3_key}",
            "description": description,
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "submission_id": submission_id,
                "user_id": token_data["id"],
                "reviewer": 0,
                "badge_id": badge_id,
                "file": f"s3://ncuchievement-submission-upload/{s3_key}",
                "description": description,
            }
        ),
    }

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { getTokenFromCookies, decodeToken, TokenData } from "../../utils/token";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);
const s3 = new S3Client({});

/**
 * API Gateway handler for endpoint /api/submission/{submission_id}
 */
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  try {
    const submissionId = event.pathParameters?.submission_id;
    if (!submissionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing submission_id parameter" }),
      };
    }

    const httpMethod = event.httpMethod;

    if (httpMethod === "GET") {
      return await handleGet(event, submissionId);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}

/**
 * Handle GET request
 */
async function handleGet(event: APIGatewayProxyEvent, submissionId: string): Promise<APIGatewayProxyResult> {
  // Authenticate user
  const cookies = event.headers?.Cookie || event.headers?.cookie || "";
  const token = getTokenFromCookies(cookies);
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Decode token
  let tokenData: TokenData;
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    tokenData = decodeToken(token, secretKey, ["HS256"]);
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Authentication failed",
      }),
    };
  }

  // Fetch submission from DynamoDB
  const getParams = {
    TableName: "submissions",
    Key: { submission_id: submissionId },
  };

  const getCommand = new GetCommand(getParams);
  const result = await dynamodb.send(getCommand);

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Submission not found" }),
    };
  }

  const submission = result.Item;

  // Authorization: Check if the user is allowed to access this submission
  if (submission.user_id !== tokenData.id && tokenData.role_id !== 1) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: You do not have access to this submission" }),
    };
  }

  // Check review status
  // Table PK is review_id, submission_id is index. Each submission has at most one review. we need the count of items.

  const getReviewParams = {
    TableName: "reviews",
    IndexName: "submission_id",
    KeyConditionExpression: "submission_id = :submission_id",
    ExpressionAttributeValues: {
      ":submission_id": submissionId,
    },
    Select: "COUNT" as const,
  };

  const queryCommand = new QueryCommand(getReviewParams);
  const reviewResult = await dynamodb.send(queryCommand);

  submission.reviewer = (reviewResult.Count || 0);

  return {
    statusCode: 200,
    body: JSON.stringify(submission),
  };
}

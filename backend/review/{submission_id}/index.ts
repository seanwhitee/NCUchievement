import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { getTokenFromCookies, decodeToken, TokenData } from "../../utils/token";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

interface ReviewRequest {
  is_approved: boolean;
}

/**
 * API Gateway handler for endpoint /api/review/{submission_id}
 */
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const submissionId = event.pathParameters?.submission_id;
    if (!submissionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing submission_id parameter" }),
      };
    }

    const httpMethod = event.httpMethod;

    if (httpMethod === "POST") {
      return await handlePost(event, submissionId);
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
};

/**
 * Handle POST request - submit a review for a submission
 */
async function handlePost(event: APIGatewayProxyEvent, submissionId: string): Promise<APIGatewayProxyResult> {
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

  // Parse request body
  const body: ReviewRequest = JSON.parse(event.body || "{}");
  const isApproved = body.is_approved;

  if (typeof isApproved !== "boolean") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request: is_approved must be a boolean" }),
    };
  }

  // Fetch the submission to verify it exists
  // review_id is PK but we don't have, submission_id is GSI, so we query by it, also check the reviewer_user_id
  const queryParams = {
    TableName: "reviews",
    IndexName: "submission_id",
    KeyConditionExpression: "submission_id = :submissionId",
    FilterExpression: "reviewer_user_id = :reviewerUserId",
    ExpressionAttributeValues: {
      ":submissionId": submissionId,
      ":reviewerUserId": tokenData.id,
    },
  };

  const queryCommand = new QueryCommand(queryParams);
  const queryResult = await dynamodb.send(queryCommand);

  // Admin check
  if (tokenData.role_id !== 1) {
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Submission not found or access denied" }),
      };
    }
  }

  if (queryResult?.Items?.[0].status !== 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Submission has already been reviewed" }),
    };
  }

  // Update the review status
  const updateParams = {
    TableName: "reviews",
    Key: { review_id: queryResult.Items[0].review_id },
    UpdateExpression: "SET #status = :isApproved, reviewed_at = :reviewedAt",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":isApproved": isApproved ? 1 : 2,
      ":reviewedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW" as const,
  };

  const updateCommand = new UpdateCommand(updateParams);
  const updateResult = await dynamodb.send(updateCommand);

  // Update submission status in submissions table
  const submissionUpdateParams = {
    TableName: "submissions",
    Key: { submission_id: submissionId },
    UpdateExpression: "SET #reviewer = #reviewer + :increment",
    ExpressionAttributeNames: {
      "#reviewer": "reviewer",
    },
    ExpressionAttributeValues: {
      ":increment": 1,
    },
    ReturnValues: "ALL_NEW" as const,
  };

  const submissionUpdateCommand = new UpdateCommand(submissionUpdateParams);
  const submissionUpdateResult = await dynamodb.send(submissionUpdateCommand);

  let submission = submissionUpdateResult.Attributes;

  // if reviewer reaches 3, update submission status
  if (submission?.reviewer >= 3) {
    const reviewQueryParams = {
      TableName: "reviews",
      IndexName: "submission_id",
      KeyConditionExpression: "submission_id = :submissionId",
      ExpressionAttributeValues: {
        ":submissionId": submissionId,
      },
      ProjectionExpression: "#status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
    };

    const reviewQueryCommand = new QueryCommand(reviewQueryParams);
    const reviewQueryResult = await dynamodb.send(reviewQueryCommand);

    const totalReviews = reviewQueryResult.Count || 0;

    // Count approved reviews
    let approvedCount = 0;
    let rejectedCount = 0;
    for (const review of reviewQueryResult.Items || []) {
      if (review.status === 1) {
        approvedCount++;
      } else if (review.status === 2) {
        rejectedCount++;
      }
    }

    let finalStatus = 2; // Default to rejected
    if (approvedCount > rejectedCount) {
      finalStatus = 1; // Approved
    }

    const finalSubmissionUpdateParams = {
      TableName: "submissions",
      Key: { submission_id: submissionId },
      UpdateExpression: "SET #status = :finalStatus",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":finalStatus": finalStatus,
      },
      ReturnValues: "ALL_NEW" as const,
    };

    const finalSubmissionUpdateCommand = new UpdateCommand(finalSubmissionUpdateParams);
    const finalSubmissionUpdateResult = await dynamodb.send(finalSubmissionUpdateCommand);
    submission = finalSubmissionUpdateResult.Attributes;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      submission_id: submissionId,
      description: submission?.description,
      file: submission?.file,
      reviewer: submission?.reviewer,
      status: submission?.status,
    }),
  };
}

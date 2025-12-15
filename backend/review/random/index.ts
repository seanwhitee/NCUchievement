import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { getTokenFromCookies, decodeToken, TokenData } from "../../utils/token";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

/**
 * API Gateway handler for endpoint /api/review/random
 */
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const httpMethod = event.httpMethod;

    if (httpMethod === "GET") {
      return await handleGet(event);
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
 * Handle GET request - randomly pick a submission for review
 */
async function handleGet(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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

  // Randomly pick a submission using a random GUID as ExclusiveStartKey
  // Filter for submissions with reviewer count < 3
  const randomGuid = uuidv4();
  const scanParams = {
    TableName: "submissions",
    ExclusiveStartKey: {
      submission_id: randomGuid,
    },
    FilterExpression: "reviewer < :maxReviewer",
    ExpressionAttributeValues: {
      ":maxReviewer": 3,
    },
    Limit: 1,
  };

  let submission;

  while (true) {
    const scanCommand = new ScanCommand(scanParams);
    const result = await dynamodb.send(scanCommand);

    // If no items found with the random start key, scan from the beginning
    if (!result.Items || result.Items.length === 0) {
      // @ts-expect-error
      delete scanParams.ExclusiveStartKey;
      continue;
    }

    // If we found a submission, check if the user has already reviewed it
    submission = result.Items[0];

    const reviewCheckParams = {
      TableName: "reviews",
      FilterExpression: "submission_id = :submissionId AND reviewer_user_id = :reviewerUserId",
      ExpressionAttributeValues: {
        ":submissionId": submission.submission_id,
        ":reviewerUserId": tokenData.id,
      },
    };

    const reviewCheckCommand = new ScanCommand(reviewCheckParams);
    const reviewCheckResult = await dynamodb.send(reviewCheckCommand);

    // If the user has not reviewed this submission, break the loop
    if (!reviewCheckResult.Items || reviewCheckResult.Items.length === 0) {
      break;
    }

    // Update ExclusiveStartKey to continue scanning
    scanParams.ExclusiveStartKey = {
      submission_id: submission.submission_id,
    };
  }

  // Create a review assignment
  const reviewAssignment = {
    review_id: uuidv4(),
    submission_id: submission.submission_id,
    reviewer_user_id: tokenData.id,
    assigned_at: new Date().toISOString(),
    status: 0, // 0 = assigned, 1 = approved, 2 = rejected
  };

  const putParams = {
    TableName: "reviews",
    Item: reviewAssignment,
  };

  const putCommand = new PutCommand(putParams);
  await dynamodb.send(putCommand);

  // Return the submission data
  return {
    statusCode: 200,
    body: JSON.stringify({
      submission_id: submission.submission_id,
      description: submission.description || "",
      file: submission.file || "",
      reviewer: submission.reviewer || 0,
      user_id: submission.user_id,
      badge_id: submission.badge_id,
    }),
  };
}

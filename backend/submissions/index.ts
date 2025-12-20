import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getTokenFromCookies, decodeToken, TokenData } from "../utils/token";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

interface SubmissionResponse {
  badge_id: string;
  submission_id: string;
  user_id: string;
  reviewer: number;
  file: string;
  description: string;
  status: number;
}

/**
 * API Gateway handler for endpoint /api/submissions
 * [Admin] Get all submissions
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
 * Handle GET request - retrieve all submissions
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

  // Admin check
  if (tokenData.role_id !== 1) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: Admin access required" }),
    };
  }

  // Scan the submissions table to get all submissions
  const scanParams = {
    TableName: "submissions",
  };

  const scanCommand = new ScanCommand(scanParams);
  const scanResult = await dynamodb.send(scanCommand);

  if (!scanResult.Items || scanResult.Items.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify([]),
    };
  }

  // Map the results to the expected response format
  const submissions: SubmissionResponse[] = scanResult.Items.map(item => ({
    badge_id: item.badge_id,
    submission_id: item.submission_id,
    user_id: item.user_id,
    reviewer: item.reviewer || 0,
    file: item.file,
    description: item.description,
    status: item.status,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(submissions),
  };
}

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { getTokenFromCookies, decodeToken, TokenData } from "../../../utils/token";

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);
const s3 = new S3Client({});

/**
 * API Gateway handler for endpoint /badge/{badge_id}/submission
 */
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const badgeId = event.pathParameters?.badge_id;
    if (!badgeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing badge_id parameter" }),
      };
    }

    const httpMethod = event.httpMethod;

    if (httpMethod === "POST") {
      return await handlePost(event, badgeId);
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
 * Handle POST request
 */
async function handlePost(event: APIGatewayProxyEvent, badgeId: string): Promise<APIGatewayProxyResult> {
  // Check badge_id exists
  const badgeTableName = "badges";
  const getBadgeCommand = new GetCommand({
    TableName: badgeTableName,
    Key: { badge_id: badgeId },
  });

  const badgeResponse = await dynamodb.send(getBadgeCommand);
  if (!badgeResponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Badge not found" }),
    };
  }

  // Check login status
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
  const body: SubmissionRequest = JSON.parse(event.body || "{}");
  const description = body.description || "";
  const fileData = body.file || ""; // Object URL, data:image/png;base64,....

  let s3Key = "";
  if (fileData) {
    // Extract content type and decode base64
    const fileContentType = fileData.substring(5, fileData.indexOf(";"));
    const fileExtension = fileContentType.split("/")[1];
    const base64Data = fileData.split(",")[1];
    const fileBytes = Buffer.from(base64Data, "base64");

    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
    s3Key = `submissions/${badgeId}/${tokenData.id}_${timestamp}.${fileExtension}`;

    // Upload to S3
    const bucketName = "ncuchievement-submission-upload";
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileBytes,
      ContentType: fileContentType,
    });

    await s3.send(putObjectCommand);
  }

  // Save to DynamoDB
  const submissionTableName = "submissions";
  const submissionId = uuidv4();

  const putCommand = new PutCommand({
    TableName: submissionTableName,
    Item: {
      submission_id: submissionId,
      user_id: tokenData.id,
      badge_id: badgeId,
      file: s3Key ? `s3://ncuchievement-submission-upload/${s3Key}` : "",
      description: description,
      reviewer: 0,
    },
  });

  await dynamodb.send(putCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({
      submission_id: submissionId,
      user_id: tokenData.id,
      badge_id: badgeId,
      file: s3Key ? `s3://ncuchievement-submission-upload/${s3Key}` : "",
      description: description,
      reviewer: 0,
    }),
  };
}

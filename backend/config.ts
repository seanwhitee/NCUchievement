import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  clientId: z.string().min(1, { message: "Missing env clientId" }),
  clientSecret: z.string().min(1, { message: "Missing env clientSecret" }),
  scope: z.string().min(1, { message: "Missing env scope" }),
  backendBaseUrl: z.string().min(1, { message: "Missing env baseUrl" }),
  frontendBaseUrl: z.string().min(1, { message: "Missing env baseUrl" }),
  secretKey: z.string().min(1, { message: "Missing env baseUrl" }),
  redirectUrl: z.string(),
  oauthTokenUrl: z.string(),
  oauthUserInfoUrl: z.string(),
});
export type Config = z.infer<typeof configSchema>;
export const getConfig = (): Config => {
  const oauthTokenUrl = "https://portal.ncu.edu.tw/oauth2/token";
  const oauthUserInfoUrl = "https://portal.ncu.edu.tw/apis/oauth/v1/info";
  const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE,
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    redirectUrl: `${process.env.BACKEND_BASE_URL}/oauth/callback`,
    oauthTokenUrl,
    oauthUserInfoUrl,
    secretKey: process.env.SECRET_KEY,
  };
  return configSchema.parse(config);
};

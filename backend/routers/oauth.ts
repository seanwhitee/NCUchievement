import { publicProcedure, router } from "../trpc";
import { getConfig } from "../config";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { authorize } from "../utils/oauth/authorize";
import { handleOauthLogin } from "../service/handleOauthLogin";
import { issue } from "../utils/jwt/issue";
import { User } from "../domain/entity/user";

export const oauthRouter = router({
  startOauth: publicProcedure.query(({ ctx }) => {
    const state = crypto.randomUUID();
    const { clientId, scope, redirectUrl } = getConfig();

    const authURL = [
      "https://portal.ncu.edu.tw/oauth2/authorization?response_type=code",
      `&client_id=${clientId}`,
      `&redirect_uri=${redirectUrl}`,
      `&scope=${scope}`,
      `&state=${state}`,
    ];
    ctx.resHeaders[
      "Set-Cookie"
    ] = `oauth_state=${state}; HttpOnly; Secure=false; SameSite=Lax; Path=/; Max-Age=${
      60 * 5
    }`;
    return {
      authUrl: authURL.join(""),
    };
  }),
  callback: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
      })
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{ success: boolean; redirectUrl: string }> => {
        const { code, state } = input;

        const cookieState = ctx.reqCookies["oauth_state"];

        if (!code || !state || !cookieState) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Missing code, state, or oauth_state cookie.",
          });
        }

        if (state !== cookieState) {
          console.error(
            `State mismatch: Query param "${state}" vs Cookie "${cookieState}"`
          );
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "OAuth state mismatch. Possible CSRF attack.",
          });
        }

        let identifier: string;
        try {
          identifier = await authorize(code, state);
        } catch (e) {
          console.error("OAuth authorization failed:", e);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `OAuth authorization failed: ${
              e.message || "Unknown error"
            }`,
          });
        }

        let user: User;
        try {
          // TODO: handle db insert and assign it to userResponse
          const user = await handleOauthLogin(identifier);
        } catch (e) {
          console.error("User login handling failed:", e);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `OAuth user handling failed: ${
              e.message || "Unknown error"
            }`,
          });
        }

        const token = await issue(user);
        ctx.resHeaders[
          "Set-Cookie"
        ] = `access_token=${token}; HttpOnly; Secure=false; SameSite=Lax; Path=/; Max-Age=${
          60 * 60 * 24 * 7 // 7 days
        }`;
        const { frontendBaseUrl } = getConfig();
        return {
          success: true,
          redirectUrl: `${frontendBaseUrl}/platform`,
        };
      }
    ),
});

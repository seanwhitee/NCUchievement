import { initTRPC } from "@trpc/server";
import {
  CreateAWSLambdaContextOptions,
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { appRouter } from "./routers";
import { parseCookies } from "./utils/parseCookies";
import { getConfig } from "./config";

const createContext = ({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const incomingCookies = parseCookies(event.headers?.cookie);
  return {
    resHeaders: {},
    reqCookies: incomingCookies,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

function getAccessControlAllowOrigin(stage: string) {
  if (stage === "dev") {
    return "*";
  } else if (stage === "prod") {
    return "https://example.com";
  } else {
    throw new Error(
      "Could not determine Access-Control-Allow-Origin from stage env var"
    );
  }
}

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
  responseMeta: ({ ctx }) => {
    const config = getConfig();
    return {
      headers: {
        ...ctx.resHeaders,
        "Access-Control-Allow-Origin": getAccessControlAllowOrigin(
          config.stage
        ),
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "authorization",
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

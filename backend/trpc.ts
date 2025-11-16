import { initTRPC } from "@trpc/server";
import {
  CreateAWSLambdaContextOptions,
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { appRouter } from "./routers";
import { parseCookies } from "./utils/parseCookies";

const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const incomingCookies = parseCookies(event.headers?.cookie);
  return {
    resHeaders: {},
    reqCookies: incomingCookies,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
  responseMeta: ({ ctx }) => {
    return {
      ...ctx.resHeaders,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

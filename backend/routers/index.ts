import { publicProcedure, router } from "../trpc";
import { oauthRouter } from "./oauth";

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello tRPC v10!"),
  oauth: oauthRouter,
});

export type AppRouter = typeof appRouter;

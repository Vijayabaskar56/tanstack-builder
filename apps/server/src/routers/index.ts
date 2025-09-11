import { publicProcedure } from "../lib/orpc";
import type { RouterClient } from "@orpc/server";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

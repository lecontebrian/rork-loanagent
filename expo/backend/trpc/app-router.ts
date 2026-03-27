import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import getSnapshotBuildStatusRoute from "./routes/builds/getSnapshotBuildStatus/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  builds: createTRPCRouter({
    getSnapshotBuildStatus: getSnapshotBuildStatusRoute,
  }),
});

export type AppRouter = typeof appRouter;

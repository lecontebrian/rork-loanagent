import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const snapshotBuildStatusInputSchema = z.object({
  sourceHash: z.string().optional().default("unknown"),
});

export default publicProcedure
  .input(snapshotBuildStatusInputSchema)
  .query(({ input }) => {
    console.log("[tRPC] builds.getSnapshotBuildStatus called", {
      sourceHash: input.sourceHash,
    });

    return {
      sourceHash: input.sourceHash,
      status: "ready" as const,
      isReady: true,
      shouldRefresh: false,
      updatedAt: new Date().toISOString(),
    };
  });

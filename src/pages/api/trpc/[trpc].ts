import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import prisma from '@lib/prisma';
import maps from '@lib/csmappool';

export const appRouter = trpc
  .router()
  .query('csgoMatch', {
    input: z.object({
      matchId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      console.log({ input, ctx });
      // const match = await prisma.cSGOMatch.findUnique({
      //   where: { id: input.matchId },
      // });
      return { match: 'test' };
    },
  })
  .query('csgoMatches', {
    async resolve() {
      const matches = await prisma.cSGOMatch.findMany();
      return { matches };
    },
  })
  .mutation('createCSGOMatch', {
    async resolve() {
      const match = await prisma.cSGOMatch.create({
        data: { maps },
      });
      return { match };
    },
  })
  .mutation('addPlayerToCsgoMatch', {
    input: z.object({
      matchId: z.string(),
      playerId: z.string(),
      team: z.string(),
    }),
    resolve: async ({ input }) => {
      const match = await prisma.cSGOMatch.update({
        where: { id: input.matchId },
        data:
          input.team === '1'
            ? { team1Players: { push: input.playerId } }
            : { team2Players: { push: input.playerId } },
      });
      return { match };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

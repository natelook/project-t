import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
// import { z } from 'zod';
import prisma from '@lib/prisma';
import maps from '@lib/csmappool';

export const appRouter = trpc
  .router()
  .query('match', {
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
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

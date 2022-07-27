import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import prisma from '@lib/prisma';
import maps from '@lib/csmappool';
import { hash } from 'argon2';
import { signUpSchema } from 'src/server/validation/auth';
import { createContext, Context } from 'src/server/ context';

export const appRouter = trpc
  .router<Context>()
  .mutation('teamInviteResponse', {
    input: z.object({
      answer: z.string(),
      inviteId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      if (!ctx.session)
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be signed in',
        });
      const { answer, inviteId } = input;
      if (answer === 'decline') {
        await prisma.teamInvitation.update({
          where: { id: inviteId },
          data: { status: 'Declined' },
        });
        return { message: 'Successfully declined invitation' };
      }

      const teamInvite = await prisma.teamInvitation.update({
        where: { id: inviteId },
        data: { status: 'Accepted' },
        select: { id: true, team: true, invitedPlayerId: true },
      });

      await prisma.team.update({
        where: { id: teamInvite.team.id },
        data: { players: { connect: { id: teamInvite.invitedPlayerId } } },
      });

      return {
        message: `Accepted invitation and joined ${teamInvite.team.name}`,
      };
    },
  })
  .mutation('changeUsername', {
    input: z.object({
      username: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { session } = ctx;
      console.log(session);
      if (!session) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        });
      }
      const { username } = input;

      const update = await prisma.user.update({
        where: { id: session.user.id as string },
        data: { username },
      });
      console.log({ update });
      return { update };
    },
  })
  .query('user', {
    async resolve({ ctx }) {
      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be signed in',
        });
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session?.id as string },
        include: {
          teamInvitations: {
            include: {
              team: {
                include: { players: true },
              },
            },
          },
          ownedTeams: true,
          teams: true,
        },
      });
      return user;
    },
  })
  .mutation('signUp', {
    input: signUpSchema,
    resolve: async ({ input, ctx }) => {
      const { username, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const hasedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hasedPassword },
      });

      return {
        status: 201,
        message: 'Account created successufully',
        result: result.email,
      };
    },
  })
  .query('tournaments', {
    async resolve() {
      const tournaments = await prisma.tournament.findMany({
        include: {
          registrants: true,
        },
        orderBy: { startDate: 'asc' },
      });
      return { tournaments };
    },
  })
  .query('tournament', {
    input: z.object({
      slug: z.string(),
    }),
    resolve: async ({ input }) => {
      const tournament = await prisma.tournament.findUnique({
        where: { slug: input.slug },
        include: {
          registrants: {
            orderBy: { registeredAt: 'desc' },
            include: {
              team: {
                include: {
                  players: true,
                },
              },
            },
          },
          matches: {
            include: { teamOne: true, teamTwo: true, tournament: true },
            orderBy: { matchId: 'asc' },
          },
        },
      });
      return { tournament };
    },
  })
  .query('csgoMatch', {
    input: z.object({
      matchId: z.string(),
    }),
    resolve: async ({ input }) => {
      const match = await prisma.cSGOMatch.findUnique({
        where: { id: input.matchId },
      });
      return { match };
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
  })
  .mutation('csgoVeto', {
    input: z.object({
      matchId: z.string(),
      updatedMaps: z.object({
        de_mirage: z.boolean(),
        de_inferno: z.boolean(),
        de_dust2: z.boolean(),
        de_nuke: z.boolean(),
        de_overpass: z.boolean(),
        de_train: z.boolean(),
        de_vertigo: z.boolean(),
        de_ancient: z.boolean(),
      }),
      map: z.string().optional(),
    }),
    resolve: async ({ input }) => {
      const match = await prisma.cSGOMatch.update({
        where: { id: input.matchId },
        data: { maps: input.updatedMaps, map: input.map },
      });
      return { match };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

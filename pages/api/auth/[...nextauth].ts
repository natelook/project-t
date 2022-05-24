import NextAuth from 'next-auth/next';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '@lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
  ],
  callbacks: {
    session: async (session: any) => {
      /* eslint no-param-reassign: "error" */
      session.userId = session.user.id;
      return Promise.resolve(session);
    },
  },
  adapter: PrismaAdapter(prisma),
});

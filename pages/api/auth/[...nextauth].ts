import NextAuth from 'next-auth/next';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '@lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import makeNoun from '@lib/nouns-playground';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
  ],
  callbacks: {
    session: async (session: any) => {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { pfp: true },
      });
      if (user) {
        session.pfp = user.pfp;
      }

      /* eslint no-param-reassign: "error" */
      session.userId = session.user.id;
      session.test = 'hello';

      return Promise.resolve(session);
    },
  },
  // events: {
  //   createUser: async ({ user }) => {
  //     const base64 = await makeNoun();
  //     if (!base64) return;
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: { pfp: base64 },
  //     });
  //   },
  //   signIn: async ({ user }) => {
  //     const u = await prisma.user.findUnique({ where: { id: user.id } });
  //     if (u?.pfp) return;
  //     const base64 = await makeNoun();
  //     console.log({ base64 });
  //     if (!base64) return;
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: { pfp: base64 },
  //     });
  //   },
  // },
  adapter: PrismaAdapter(prisma),
});

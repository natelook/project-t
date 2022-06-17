import NextAuth from 'next-auth/next';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import makeNoun from '@lib/nouns-playground';

const allowed = [
  'nate@tournaments.wtf',
  'admin@tournaments.wtf',
  'nate@natelook.com',
  'obcd@tournaments.wtf',
  'mach@tournaments.wtf',
  '0x2a7f@gmail.com',
  'chris.lwlr@gmail.com',
];

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
    signIn: async ({ user }: Partial<{ user: { email?: string } }>) => {
      if (!user.email) {
        return false;
      }
      const isAllowed = allowed.includes(user.email);
      return isAllowed;
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    newUser: '/welcome',
  },
});

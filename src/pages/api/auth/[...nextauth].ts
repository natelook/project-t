import NextAuth from 'next-auth/next';
import prisma from '@lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@server/validation/auth';
import { verify } from 'argon2';
import { NextAuthOptions } from 'next-auth';

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email...',
        },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (crendentials, request) => {
        const creds = await loginSchema.parseAsync(crendentials);
        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id; // eslint-disable-line no-param-reassign
        token.email = user.email; // eslint-disable-line no-param-reassign
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id; // eslint-disable-line no-param-reassign
      }

      return session;
    },
  },
  jwt: {
    secret: 'super-secret',
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: '/',
    newUser: '/sign-up',
  },
  // adapter: PrismaAdapter(prisma),
};

export default NextAuth(nextAuthOptions);

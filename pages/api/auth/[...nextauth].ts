import NextAuth from 'next-auth/next';
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord';
import prisma from '@lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET!,

      // profile(profile: DiscordProfile) {
      //   if (profile.avatar === null) {
      //     const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
      //     profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      //   } else {
      //     const format = profile.avatar.startsWith("a_") ? "gif" : "png";
      //     profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      //   }
      //   return {
      //     id: profile.id,
      //     verified: profile.verified,
      //     discord: `${profile.username}#${profile.discriminator}`,
      //     pfp: profile.image_url,
      //     name: profile.username,
      //     email: profile.email,
      //   };
      // },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      console.log({ session, token });
      // if (session?.user) {
      //   session.user.id = token.uid;
      // }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});

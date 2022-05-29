import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Or string
      pfp: string;
    } & DefaultSession['user'];
  }
}

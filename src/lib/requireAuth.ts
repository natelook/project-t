import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { nextAuthOptions } from '../pages/api/auth/[...nextauth]';

// eslint-disable-next-line
export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions,
    );

    if (!session) {
      return {
        redirect: {
          destination: '/', // login path
          permanent: false,
        },
      };
    }

    // eslint-disable-next-line
    return await func(ctx);
  };

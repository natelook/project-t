import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

import { Layout } from '@components/common';
import { Button } from '@components/ui';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <div>
          <Image
            src="/logo.png"
            alt="Glasses"
            width="450px"
            height="184px"
            priority
          />
        </div>
        <h1 className="text-6xl uppercase font-nouns tracking-wider text-center">
          Tournaments.wtf
        </h1>
        <div className="flex space-x-5 w-full">
          <div className="flex-1">
            <Button
              label="Create Team"
              onClick={() => router.push('/teams/create')}
              style="secondary"
            >
              Create Team
            </Button>
          </div>
          <div className="flex-1">
            <Button
              label="Tournaments"
              onClick={() => router.push('/tournaments')}
            >
              View Tournaments
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req });
  return { props: { session } };
}

Home.Layout = Layout;

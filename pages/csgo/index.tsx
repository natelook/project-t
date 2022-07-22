import { Layout } from '@components/common';
import { Button } from '@components/ui';
import createMatch from '@lib/csgo/create-match';
import prisma from '@lib/prisma';
import { Match } from '@lib/types/csgo';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Matches({ matches }: { matches: Match[] }) {
  const router = useRouter();

  return (
    <div>
      <div>
        <Button
          label="Create Match"
          onClick={() =>
            createMatch().then((id: string) => router.push(`/csgo/match/${id}`))
          }
        >
          Create Match
        </Button>
      </div>
      <div className="grid grid-cols-3">
        {matches?.map((match) => (
          <div className="card flex justify-center" key={match.id}>
            <Link href={`/csgo/match/${match.id}`}>
              <a className="text-white">{match.id}</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const matches = await prisma.cSGOMatch.findMany({ select: { id: true } });

  return { props: { matches } };
}

Matches.Layout = Layout;

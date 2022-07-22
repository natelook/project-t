import { Heading, Layout } from '@components/common';
import createMatch from '@lib/csgo/create-match';
import prisma from '@lib/prisma';
import { Match } from '@lib/types/csgo';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Matches({ matches }: { matches: Match[] }) {
  const router = useRouter();
  console.log(matches[0]);

  return (
    <div>
      <div>
        <Heading
          name="Counter-Strike Matches"
          isOwner={true}
          primaryButtonText="Create Match"
          primaryButton={() =>
            createMatch().then((id: string) => {
              id && router.push(`/csgo/match/${id}`);
              console.log(id);
            })
          }
        />
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
  const matches = await prisma.cSGOMatch.findMany();

  return { props: { matches } };
}

Matches.Layout = Layout;

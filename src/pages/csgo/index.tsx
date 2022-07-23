import { Heading, Layout } from '@components/common';
import { trpc } from '@lib/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Matches() {
  const router = useRouter();
  const createMatch = trpc.useMutation('createCSGOMatch');
  const { data } = trpc.useQuery(['match']);

  return (
    <div>
      <div>
        <Heading
          name="Counter-Strike Matches"
          isOwner
          primaryButtonText="Create Match"
          primaryButton={() =>
            createMatch
              .mutateAsync()
              .then(({ match }) => router.push(`/csgo/match/${match.id}`))
          }
        />
      </div>
      <div className="grid grid-cols-3">
        {data?.matches.map((match) => (
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

Matches.Layout = Layout;

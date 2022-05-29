import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import TeamCard from '@components/team/card';
import { TeamWithPlayers } from '@lib/types';
import { useRouter } from 'next/router';
// import { useState } from 'react';
import { useQuery } from 'react-query';

const fetcher = async (index: number) => {
  const request = await fetch(`/api/team/all/${index}`);
  const result = await request.json();
  return result;
};

export default function TeamsPage({ data }: { data: TeamWithPlayers[] }) {
  // const [index, setIndex] = useState(1);
  const { data: teams, isLoading } = useQuery<TeamWithPlayers[]>(
    'all-teams',
    () => fetcher(1),
    {
      initialData: data,
      keepPreviousData: true,
    },
  );

  const router = useRouter();
  return (
    <main className="container">
      <TeamHeading
        name="All Teams"
        isOwner
        primaryButton={() => router.push('/teams/create')}
        primaryButtonText="Create a Team"
      />
      {isLoading && !teams ? (
        <p>Loading...</p>
      ) : (
        <ul className="grid grid-cols-4 gap-10">
          {teams?.map((team) => (
            <TeamCard
              title={team.name}
              name="Team"
              slug={`/teams/${team.id}`}
              subtitle={`Total Players ${team.players.length}`}
              key={team.id}
              players={team.players}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  const request = await fetch(`${process.env.NEXTAUTH_URL}/api/team/all/1`);
  const teams = await request.json();
  return { props: { data: teams } };
}

TeamsPage.Layout = Layout;

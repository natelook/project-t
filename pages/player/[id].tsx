import Layout from '@components/ui/Layout';
import { Team, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

interface PlayerWithTeams extends User {
  teams: Team[];
}

export default function PlayerPage({ player }: { player: PlayerWithTeams }) {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold">{player.name}</h1>
      <h3>Teams</h3>
      {player.teams && (
        <ul>
          {player.teams.map((team) => (
            <li key={team.id}>
              <Link href={`/teams/${team.id}`}>
                <a>{team.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/${context.params?.id}`,
  );
  const player = await request.json();

  return { props: { player } };
}

PlayerPage.Layout = Layout;

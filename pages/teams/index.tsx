import { Layout } from '@components/common';
import { Team } from '@prisma/client';
import Link from 'next/link';

export default function TeamsPage({ teams }: { teams: Team[] }) {
  return (
    <main className="container">
      <div className="prose">
        <h1>Teams</h1>
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              <Link href={`/teams/${team.id}`}>
                <a>{team.name}</a>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/teams/create">
          <a>Create</a>
        </Link>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const request = await fetch(`${process.env.NEXTAUTH_URL}/api/team/all`);
  const teams = await request.json();
  return { props: { teams } };
}

TeamsPage.Layout = Layout;

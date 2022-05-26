import { Layout } from '@components/common';
import { Tournament } from '@prisma/client';
import Link from 'next/link';

interface TournamentsPageProps {
  tournaments: Tournament[];
}

export default function TournamentsPage({ tournaments }: TournamentsPageProps) {
  return (
    <div className="container max-w-2xl mt-24">
      <h1>Tournaments</h1>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <Link href={`/${tournament.slug}`}>
              <a>{tournament.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/tournaments/create">
        <a className="btn">Create Tournament</a>
      </Link>
    </div>
  );
}

export async function getServerSideProps() {
  const request = await fetch(`${process.env.NEXTAUTH_URL}/api/tournaments`);
  const tournaments = await request.json();
  return { props: { tournaments } };
}

TournamentsPage.Layout = Layout;

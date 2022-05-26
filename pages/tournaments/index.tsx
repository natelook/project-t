import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import { Tournament } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface TournamentsPageProps {
  tournaments: Tournament[];
}

export default function TournamentsPage({ tournaments }: TournamentsPageProps) {
  const router = useRouter();
  return (
    <div className="w-full">
      <TeamHeading
        name="Tournaments"
        primaryButton={() => router.push('/tournaments/create')}
        primaryButtonText="Create tournament"
      />
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <Link href={`/${tournament.slug}`}>
              <a>{tournament.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const request = await fetch(`${process.env.NEXTAUTH_URL}/api/tournaments`);
  const tournaments = await request.json();
  return { props: { tournaments } };
}

TournamentsPage.Layout = Layout;

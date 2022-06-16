import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import TournamentCard from '@components/tournament/TournamentCard';
import { TournamentWithRegistrants } from '@lib/types';
import { useRouter } from 'next/router';

interface TournamentsPageProps {
  tournaments: TournamentWithRegistrants[];
}

export default function TournamentsPage({ tournaments }: TournamentsPageProps) {
  const router = useRouter();
  return (
    <div className="w-full">
      <TeamHeading
        name="Tournaments"
        primaryButton={() => router.push('/tournaments/create')}
        primaryButtonText="Create tournament"
        isOwner
      />
      <ul className="grid grid-cols-2 gap-10">
        {tournaments.map((tournament) => (
          <TournamentCard
            name={tournament.name}
            maxPlayers={tournament.maxRegistrants}
            totalPlayers={tournament.registrants.length}
            slug={tournament.slug}
            key={tournament.id}
          />
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

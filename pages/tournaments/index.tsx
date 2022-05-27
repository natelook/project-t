import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import TeamCard from '@components/team/card';
import { TournamentWithRegistrants } from '@lib/types';
import dayjs from 'dayjs';
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
      <ul className="grid grid-cols-3 gap-10">
        {tournaments.map((tournament) => (
          <TeamCard
            title={tournament.name}
            name="Tournament"
            slug={`/${tournament.slug}`}
            key={tournament.id}
            subtitle={
              <div>
                <p>{dayjs(tournament.startDate).format('MM/DD/YY h:ma')}</p>
                <p>Registrants {tournament.registrants.length}</p>
              </div>
            }
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

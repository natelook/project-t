import { Layout, Heading } from '@components/common';
import { useRouter } from 'next/router';
import { TournamentCard } from '@components/tournament';
import { trpc } from '@lib/trpc';
import { AnimatePresence } from 'framer-motion';
import { FadeIn } from '@components/animations';

export default function TournamentsPage() {
  const { data } = trpc.useQuery(['tournaments']);
  const router = useRouter();
  return (
    <div className="w-full">
      <Heading
        name="Tournaments"
        primaryButton={() => router.push('/tournaments/create')}
        primaryButtonText="Create tournament"
        isOwner
      />
      <ul className="grid grid-cols-2 gap-10">
        <AnimatePresence>
          {data?.tournaments.map((tournament) => (
            <FadeIn key={tournament.id}>
              <TournamentCard
                name={tournament.name}
                maxPlayers={tournament.maxRegistrants}
                totalPlayers={tournament.registrants.length}
                slug={tournament.slug}
                date={tournament.startDate}
                // banner={tournament.banner}
              />
            </FadeIn>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

TournamentsPage.Layout = Layout;

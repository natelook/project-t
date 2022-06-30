import { Layout, Heading } from '@components/common';
import TeamCard from '@components/team/card';
import { TournamentWithRegistrants } from '@lib/types';
import { GetServerSidePropsContext } from 'next';

interface TournamentTeamListingProps {
  tournament: TournamentWithRegistrants;
}

export default function TournamentTeamListing({
  tournament,
}: TournamentTeamListingProps) {
  return (
    <div>
      <Heading
        breadcrumb={[
          { name: 'All Tournaments', slug: '/tournaments' },
          { name: 'Tournament Page', slug: `/${tournament.slug}` },
        ]}
        name={`${tournament.name} - Teams`}
      />

      <ul className="grid grid-cols-4 gap-10">
        {tournament.registrants.map((registrant) => (
          <TeamCard
            logo={registrant.team.logo}
            title={registrant.team.name}
            name="Team"
            slug={`/teams/${registrant.team.id}`}
            key={registrant.team.id}
            players={registrant.team.players}
          />
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}`,
  );
  const tournament = await request.json();

  if (!tournament) {
    return { notFound: true };
  }

  return { props: { tournament } };
}

TournamentTeamListing.Layout = Layout;

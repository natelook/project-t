import Layout from '@components/ui/Layout';
import { Tournament } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage({ tournament }: TournamentPageProps) {
  return (
    <div>
      <h1>{tournament.name}</h1>
    </div>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${params?.slug}`,
  );
  const tournament = await request.json();
  return { props: { tournament } };
}

TournamentPage.Layout = Layout;

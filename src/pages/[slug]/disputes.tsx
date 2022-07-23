import { Layout } from '@components/common';
import { Banner } from '@components/ui';
import { InformationCircleIcon } from '@heroicons/react/solid';
import useNotification from '@lib/hooks/useNotification';
import { DisputeWithReporterAndTeam } from '@lib/types';
import { Tournament } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import useFetch from '@lib/hooks/useFetch';
import { AnimatePresence } from 'framer-motion';
import TournamentBackButton from '@components/tournament/TournamentBackButton';

interface DisputePageProps {
  disputeData?: DisputeWithReporterAndTeam[];
  error?: string;
  tournament: Tournament;
}

export default function DisputePage({
  disputeData,
  error,
  tournament,
}: DisputePageProps) {
  const { data: disputes, refetch } = useFetch(
    `/api/tournament/${tournament.id}/get-disputes`,
    'disputes',
    disputeData,
  );
  const { message, isActive, notificationColor, triggerNotification } =
    useNotification();

  const deleteDispute = async (id: string) => {
    const request = await fetch(`/api/dispute/${id}/delete`, {
      method: 'POST',
    });

    if (request.status !== 200) {
      triggerNotification(
        'Dispute was not deleted, something went wrong',
        'danger',
      );
      return;
    }

    refetch();
    triggerNotification('Dispute Deleted');
  };

  if (error) {
    return (
      <div>
        <p className="text-danger font-bold text-3xl">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <TournamentBackButton
        tournamentName={tournament.name}
        slug={`/${tournament.slug}`}
      />
      <h1 className="text-3xl mb-3 font-bold">Disputes</h1>

      <div className="grid grid-cols-2 gap-10 px-3">
        {disputes.length !== 0 ? (
          <div>
            {disputes.map((dispute: DisputeWithReporterAndTeam) => (
              <div key={dispute.id} className="card">
                <div className="w-full">
                  <p className="text-xl flex items-center space-x-3">
                    <span>Reported by {dispute.reporter.username} </span>
                    <span className="text-gray-600 flex items-center space-x-2">
                      <span>{dispute.team.name}</span>
                      <span className="block w-6 h-6">
                        <Image
                          src={dispute.team.logo}
                          height="30px"
                          width="30px"
                          layout="responsive"
                          alt={`${dispute.team.name}'s logo'`}
                          className="rounded-full"
                        />
                      </span>
                    </span>
                  </p>
                  <div className="px-1 my-3">
                    <p className="text-gray-600">Message</p>
                    <p>{dispute.message}</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn-secondary text-sm px-3 py-2 bg-red-100 text-danger"
                      onClick={() => deleteDispute(dispute.id)}
                    >
                      Delete
                    </button>
                    <Link href={`/${tournament.slug}/${dispute.matchId}`}>
                      <a className="btn text-sm px-3 py-2">View Match</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-2xl">There are no disputes!</p>
        )}
      </div>
      <AnimatePresence>
        {isActive && (
          <Banner
            message={message}
            color={notificationColor}
            icon={<InformationCircleIcon />}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getServerSideProps({
  params,
  req,
}: GetServerSidePropsContext) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        error: 'You must be signed in and authorized to view this page.',
      },
    };
  }

  const reqTournament = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${params.slug}`,
  );
  const tournament = await reqTournament.json();

  if (
    tournament.createdBy !== session.user.id ||
    session.user.id !== process.env.SUPERADMIN
  ) {
    return {
      props: {
        error: 'You are not authorized to view disputes for this tournament',
      },
    };
  }

  // pass the tournament id instead of slug
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${tournament.id}/get-disputes`,
  );

  const disputes = await request.json();
  return { props: { disputeData: disputes, tournament } };
}

DisputePage.Layout = Layout;

DisputePage.defaultProps = {
  error: null,
  disputeData: null,
};

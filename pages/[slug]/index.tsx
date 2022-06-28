import {
  AllMatches,
  Info,
  TournamentHeading,
  Register,
} from '@components/tournament';
import { Layout } from '@components/common';
import Modal from '@components/ui/Modal';
import { Tournament } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Banner, ModalHeading } from '@components/ui';
import {
  CheckIcon,
  KeyIcon,
  PencilIcon,
  StopIcon,
} from '@heroicons/react/solid';
import { AnimatePresence } from 'framer-motion';
import SuperAdminTournament from '@components/admin/SuperAdminTournament';
import { MatchWithTeam, RegistrantWithTeamInfo } from '@lib/types';
import getTotalRounds from '@lib/get-total-rounds';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Link from 'next/link';
import useNotification from '@lib/hooks/useNotification';
import useFetch from '@lib/hooks/useFetch';

interface TournamentWithRegistrantsAndMatches extends Tournament {
  registrants: RegistrantWithTeamInfo[];
  matches: MatchWithTeam[];
}

interface TournamentPageProps {
  data: TournamentWithRegistrantsAndMatches;
  userId: string;
}

export default function TournamentPage({ data, userId }: TournamentPageProps) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [totalRounds, setTotalRounds] = useState<number[] | null>(null);

  const isAdmin = useRef(userId === data.createdBy);
  const cancelButtonRef = useRef(null);

  const { data: user } = useFetch(`/api/user/${userId}`, 'user');

  const { data: tournament, refetch } = useFetch(
    `/api/tournament/${data.slug}`,
    `tournament-${data.id}`,
    data,
  );

  const {
    isActive,
    message: notificationMessage,
    // triggerNotification,
  } = useNotification();

  const {
    isActive: errorActive,
    message: errorMessage,
    triggerNotification: triggerError,
  } = useNotification();

  const output = useMemo(
    () =>
      data.description &&
      generateHTML(JSON.parse(data.description), [StarterKit]),
    [data.description],
  );

  const startTournament = useCallback(async () => {
    const request = await fetch(`/api/tournament/${tournament.id}/start`);
    if (request.status !== 200) {
      triggerError('Something went wrong', 'danger');
      return;
    }
    refetch();
  }, [refetch, tournament.id, triggerError]);

  useEffect(() => {
    if (data.matches.length !== 0) {
      const rounds = getTotalRounds(data.matches);
      setTotalRounds(rounds);
    }
  }, [data.matches]);

  return (
    <div>
      <TournamentHeading
        name={tournament.name}
        date={tournament.startDate}
        totalRegistrants={tournament.registrants.length}
        maxRegistrants={tournament.maxRegistrants}
        game={tournament.game}
        register={() => setRegisterModalOpen(true)}
        startTournament={startTournament}
        isAdmin={isAdmin.current}
        isSignedIn={userId !== null}
        slug={tournament.slug}
      />
      <div className="mt-10">
        {tournament.started ? (
          <div>
            <h3 className="text-2xl font-bold mb-2">Tournament Bracket</h3>
            <div className="p-10 bg-gray-800 shadow shadow-gray-700 rounded">
              <AllMatches
                matches={tournament.matches}
                rounds={totalRounds}
                slug={tournament.slug}
              />
            </div>
          </div>
        ) : (
          <Info tournament={tournament} output={output} />
        )}
      </div>
      {registerModalOpen && (
        <Modal
          open={registerModalOpen}
          setOpen={(isOpen: boolean) => setRegisterModalOpen(isOpen)}
          initialFocus={cancelButtonRef}
        >
          {user?.ownedTeams.length > 0 ? (
            <React.Fragment>
              <ModalHeading
                icon={<PencilIcon />}
                title="Register a Team"
                subtext=""
              />
              <Register
                tournament={tournament}
                userTeams={user.ownedTeams}
                cancel={() => setRegisterModalOpen(false)}
                // triggerNotification={triggerNotification}
              />
            </React.Fragment>
          ) : (
            <div>
              <ModalHeading
                icon={<KeyIcon />}
                title="Tournament Registeration"
                subtext="You must create a team to register for this tournament"
              />
              <div className="px-10">
                <Link href="/teams/create">
                  <a className="btn block text-center mx-auto">Create Team</a>
                </Link>
              </div>
            </div>
          )}
        </Modal>
      )}
      <AnimatePresence>
        {isActive && (
          <Banner
            message={notificationMessage}
            icon={<CheckIcon />}
            color="primary"
          />
        )}
        {errorActive && (
          <Banner message={errorMessage} icon={<StopIcon />} color="danger" />
        )}
      </AnimatePresence>
      {process.env.SUPERADMIN === userId && (
        <SuperAdminTournament tournamentId={tournament.id} />
      )}
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

  const session = await getSession(context);
  const userId = session?.user.id;

  return { props: { data: tournament, userId: userId || null } };
}

TournamentPage.Layout = Layout;

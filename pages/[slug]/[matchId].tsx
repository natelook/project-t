import { Team, Tournament } from '@prisma/client';
import { Layout } from '@components/common';
import { MatchHeading } from '@components/tournament';
import {
  ExclamationCircleIcon,
  LightningBoltIcon,
} from '@heroicons/react/solid';
import { MatchWithTeamsAndTournament } from '@lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import React, { FormEvent, useEffect, useRef, useState, Fragment } from 'react';
import { Banner, Modal, ModalHeading } from '@components/ui';
import MatchTeam from '@components/tournament/MatchTeam';
import useNotification from '@lib/hooks/useNotification';
import MatchReport from '@components/tournament/MatchReport';
import { useSession } from 'next-auth/react';
import useFetch from '@lib/hooks/useFetch';
import FileDispute from '@components/tournament/FileDispute';

interface MatchPageProps {
  data: {
    match: MatchWithTeamsAndTournament;
    tournament: Tournament;
  };
}

export default function MatchPage({ data }: MatchPageProps) {
  const [scoreModal, setScoreModal] = useState(false);
  const [disputeModal, setDisputeModal] = useState(false);
  const [teamOneScore, setTeamOneScore] = useState(data.match.teamOneScore);
  const [teamTwoScore, setTeamTwoScore] = useState(data.match.teamTwoScore);
  const [disputeMessage, setDisputeMessage] = useState('');
  const [disputeError, setDisputeError] = useState<string | null>();
  const [matchWinner, setMatchWinner] = useState<Team | null>();
  const { isActive, message, triggerNotification, notificationColor } =
    useNotification();
  const { data: session } = useSession();

  const {
    data: { tournament, match },
    refetch,
  } = useFetch(
    `/api/tournament/${data.tournament.slug}/${data.match.matchId}`,
    `match-${data.tournament.id}-${data.match.matchId}`,
    data,
  );
  useEffect(() => {
    if (isActive) {
      setScoreModal(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (match.winner) {
      const bothTeams = [];
      bothTeams.push(match.teamOne, match.teamTwo);
      const winningTeam = bothTeams.filter(({ id }) => id === match.winner);

      setMatchWinner(winningTeam[0]);
    }
  }, [match]);

  const submitScore = async (e: FormEvent) => {
    e.preventDefault();

    const request = await fetch(
      `/api/tournament/${match.tournament.slug}/${match.matchId}/report`,
      {
        method: 'POST',
        body: JSON.stringify({
          teamOneScore,
          teamTwoScore,
          tournamentId: match.tournamentId,
        }),
      },
    );
    const response = await request.json();
    if (response.error) {
      triggerNotification(response.error, 'danger');
    }
    setScoreModal(false);
    refetch();
  };

  const createDispute = async (e: FormEvent) => {
    e.preventDefault();
    setDisputeError(null);

    if (!session) {
      setDisputeError('You must be signed in');
      return;
    }

    const ownedTeam = [match.teamOne, match.teamTwo].filter(
      (team) => team.ownerUserId === session.user.id,
    );

    if (ownedTeam.length === 0) {
      setDisputeError('You must be an owner to dispute a match');
      return;
    }

    const request = await fetch(
      `/api/tournament/${tournament.id}/${match.matchId}/dispute`,
      {
        method: 'POST',
        body: JSON.stringify({
          message: disputeMessage,
          team: ownedTeam[0],
        }),
      },
    );

    if (request.status !== 200) {
      setDisputeError(`Something went wrong. Error code ${request.status}`);
      return;
    }

    const dispute = await request.json();
    if (dispute.error) {
      setDisputeError(dispute.error);
      return;
    }

    setDisputeModal(false);
    triggerNotification('You have sent an admin your dispute', 'primary');
  };
  const cancelRef = useRef(null);

  return (
    <Fragment>
      {/* @ts-ignore */}
      <motion.div layout>
        <MatchHeading
          name={`${tournament.name} - Round ${match.round}`}
          primaryButton={() => setScoreModal(true)}
          subtitle={`Match ${match.matchId}`}
          primaryButtonText="Submit Score"
          secondaryButton={() => setDisputeModal(true)}
          secondaryButtonText="Report a Problem"
          tournamentSlug={`/${tournament.slug}`}
          tournamentName={tournament.name}
          isAuthorized={
            session?.user.id === match?.teamTwo.ownerUserId ||
            session?.user.id === match?.teamOne.ownerUserId ||
            session?.user.id === process.env.SUPERADMIN
          }
        />
        <AnimatePresence>
          {matchWinner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto w-full"
            >
              <p className="text-success text-center text-3xl">
                {matchWinner.name} won the match
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout className="grid grid-cols-match gap-x-10 mt-20">
          {match.teamOne && (
            <MatchTeam
              team={match.teamOne}
              score={teamOneScore}
              winner={matchWinner?.id}
            />
          )}
          <div className="h-full flex items-center justify-center">
            <span className="font-bold font-nouns text-5xl">VS</span>
          </div>
          {match.teamTwo && (
            <MatchTeam
              team={match.teamTwo}
              score={teamTwoScore}
              winner={matchWinner?.id}
            />
          )}
        </motion.div>
      </motion.div>
      {scoreModal && (
        <Modal
          open={scoreModal}
          setOpen={() => setScoreModal(true)}
          initialFocus={cancelRef}
        >
          <ModalHeading
            title="Report Score"
            icon={<LightningBoltIcon />}
            subtext="Report the final score for this match. If you have a dispute please contact an admin."
          />
          <MatchReport
            submitScore={submitScore}
            match={match}
            teamOneScore={teamOneScore}
            teamTwoScore={teamTwoScore}
            close={() => setScoreModal(false)}
            setTeamOneScore={setTeamOneScore}
            setTeamTwoScore={setTeamTwoScore}
          />
        </Modal>
      )}
      {disputeModal && (
        <Modal open={disputeModal} setOpen={() => setDisputeModal(true)}>
          <ModalHeading
            title="File an Issue"
            icon={<ExclamationCircleIcon />}
            subtext="Report an issue so an admin can review"
          />
          <FileDispute
            message={disputeMessage}
            inputOnChange={(value) => setDisputeMessage(value)}
            formSubmit={createDispute}
            error={disputeError}
            close={() => setDisputeModal(false)}
          />
        </Modal>
      )}
      <AnimatePresence>
        {isActive && (
          <Banner
            icon={<ExclamationCircleIcon />}
            message={message}
            color={notificationColor}
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
}

MatchPage.Layout = Layout;
MatchPage.auth = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}/${context.params?.matchId}`,
  );

  const data = await request.json();

  return { props: { data } };
}

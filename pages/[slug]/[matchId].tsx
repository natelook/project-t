import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import { Banner, Button, Modal, ModalHeading } from '@components/ui';
import {
  ExclamationCircleIcon,
  LightningBoltIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid';
import pfp from '@lib/pfp';
import {
  MatchWithTeamsAndTournament,
  TeamWithPlayersAndOwner,
} from '@lib/types';
import { AnimatePresence } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

interface MatchPageProps {
  matchData: MatchWithTeamsAndTournament;
}

interface TeamProps {
  team: TeamWithPlayersAndOwner;
  score: number;
}

const Team: React.FC<TeamProps> = ({ team, score }) => (
  <div className="space-y-8">
    <Link href={`/teams/${team.id}`}>
      <a>
        <h4 className="text-5xl font-bold text-center">{team.name}</h4>
      </a>
    </Link>
    <span className="block text-center text-7xl">{score}</span>
    <div className="flex justify-between bg-nouns-bg px-10 pt-5 rounded">
      {team?.players.map((player) => (
        <div key={player.id} className="w-20 h-20">
          <Image
            src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
            layout="responsive"
            height={50}
            width={50}
          />
        </div>
      ))}
    </div>
  </div>
);

interface ScoreInputProps {
  name: string;
  score: number;
  updateScore: (value: number) => void;
}

const ScoreInput = ({ name, score, updateScore }: ScoreInputProps) => (
  <div className="mb-3">
    <label
      htmlFor="team-two-score"
      className="text-2xl text-center w-full block mb-3"
    >
      {name}&apos;s Score
    </label>
    <div className="flex justify-evenly space-x-3">
      <button
        type="button"
        className="block w-6 text-gray-500"
        onClick={() => updateScore(score - 1)}
      >
        <MinusCircleIcon />
      </button>
      <span className="text-2xl">{score}</span>
      <button
        type="button"
        className="block w-6 text-gray-500"
        onClick={() => updateScore(score + 1)}
      >
        <PlusCircleIcon />
      </button>
    </div>
  </div>
);

const fetcher = (slug: string, matchId: number) =>
  fetch(`/api/tournament/${slug}/${matchId}`).then((data) => data.json());

export default function MatchPage({ matchData }: MatchPageProps) {
  const [scoreModal, setScoreModal] = useState(false);
  const [teamOneScore, setTeamOneScore] = useState(matchData.teamOneScore);
  const [teamTwoScore, setTeamTwoScore] = useState(matchData.teamTwoScore);
  const [error, setError] = useState<string | null>();

  const { data: match } = useQuery(
    `match-${matchData.tournamentId}-${matchData.matchId}`,
    () => fetcher(matchData.tournament.slug, matchData.matchId),
    { initialData: matchData },
  );

  useEffect(() => {
    if (error) {
      setScoreModal(false);
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      setScoreModal(false);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }

    return () => clearTimeout();
  }, [error]);

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
      setError(response.error);
    }
    setScoreModal(false);
  };

  const cancelRef = useRef(null);

  // const report = () => {};
  return (
    <React.Fragment>
      <div>
        <TeamHeading
          breadcrumb={[
            { name: 'Tournament Page', slug: `/${match.tournament.slug}` },
          ]}
          name={`${match.tournament.name} - Match ${match.matchId}`}
          primaryButton={() => setScoreModal(true)}
          primaryButtonText="Submit Score"
          secondaryButton={() => {}}
          secondaryButtonText="Report a Problem"
          isOwner
        />
        <p>Winner: {match.winner}</p>
        <div className="grid grid-cols-match gap-x-10 mt-20">
          {match.teamOne && <Team team={match.teamOne} score={teamOneScore} />}
          <div className="h-full flex items-center justify-center">
            <span className="font-bold font-nouns text-5xl">VS</span>
          </div>
          {match.teamTwo && <Team team={match.teamTwo} score={teamTwoScore} />}
        </div>
      </div>
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
          <form onSubmit={submitScore}>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 place-content-center">
              <ScoreInput
                name={match.teamOne.name}
                score={teamOneScore}
                updateScore={(score) =>
                  score <= match.winningScore &&
                  setTeamOneScore(score <= 0 ? 0 : score)
                }
              />
              <ScoreInput
                name={match.teamTwo.name}
                score={teamTwoScore}
                updateScore={(score) =>
                  score <= match.winningScore &&
                  setTeamTwoScore(score <= 0 ? 0 : score)
                }
              />
              <div className="col-span-2 flex space-x-3 w-full">
                <Button
                  label="Close Modal"
                  onClick={() => setScoreModal(false)}
                  style="secondary"
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button type="submit" label="submit score" onClick={() => {}}>
                  Submit Score
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
      <AnimatePresence>
        {error && (
          <Banner
            icon={<ExclamationCircleIcon />}
            message={error}
            color="red"
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

MatchPage.Layout = Layout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}/${context.params?.matchId}`,
  );
  if (request.status !== 200) {
    return { notFound: true };
  }
  const matchData = await request.json();

  return { props: { matchData } };
}

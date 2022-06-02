import { AddPlayer, TeamHeading, TeamStats } from '@components/team';
import { Layout } from '@components/common';
import Modal from '@components/ui/Modal';
import {
  MatchWithTeamsAndTournament,
  RegistrantWithTournamentInfo,
  TeamWithPlayersAndOwner,
} from '@lib/types';
import { Team, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { Banner } from '@components/ui';
import { CheckIcon } from '@heroicons/react/outline';
import useNotification from '@lib/hooks/useNotification';
import classNames from 'classnames';
import dayjs from 'dayjs';
import TeamPlayers from '@components/team/TeamPlayers';
import { ImageData } from '@nouns/assets';
// import { SpeakerphoneIcon } from '@heroicons/react/solid';
// import validateTeamOwner from '@lib/validateUser';

interface MatchesRenamedForTeam extends MatchWithTeamsAndTournament {
  teamScore: number;
  oppenentScore: number;
  opponent: Team;
}

interface TeamWithCount extends TeamWithPlayersAndOwner {
  _count: number;
  matches: MatchesRenamedForTeam[];
  tournaments: RegistrantWithTournamentInfo[];
}

interface TeamPageProps {
  data: TeamWithCount;
  userId?: string;
}

const fetcher = async (teamId: string) => {
  const request = await fetch(`/api/team/${teamId}`);
  const result = await request.json();
  return result;
};

export default function TeamPage({ data, userId }: TeamPageProps) {
  const [playerName, setPlayerName] = useState<string>('');
  const [playerResults, setPlayerResults] = useState<null | User>();
  const [error, setError] = useState<string | null>();
  const [addPlayerModalisOpen, setAddPlayerModalOpen] = useState(false);
  const { isActive, message, triggerNotification } = useNotification();

  const { data: team, isLoading } = useQuery<TeamWithCount>(
    `team-${data.id}`,
    () => fetcher(data.id),
    {
      initialData: data,
    },
  );

  const cancelButton = useRef(null);

  const searchPlayer = async (e: FormEvent) => {
    e.preventDefault();
    if (!playerName) return;

    const request = await fetch('/api/user/search', {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    });
    const results = await request.json();
    setPlayerResults(results);
  };

  const addPlayer = async () => {
    if (!playerResults || !userId || !team) return;
    // const isOwner = await validateTeamOwner(team.id, userId);
    // if (!isOwner) return;

    const request = await fetch('/api/team/invite-player', {
      method: 'POST',
      body: JSON.stringify({
        teamId: team.id,
        playerId: playerResults.id,
      }),
    });
    if (request.status === 401) {
      setError('Only the owner can add players');
      return;
    }
    if (request.status !== 200) {
      setError('Something went wrong.');
    }
    const invite = await request.json();

    triggerNotification(
      `You invited ${invite.invitedPlayer.username} to ${team.name}`,
    );
    setAddPlayerModalOpen(false);
    setPlayerName('');
    setPlayerResults(null);
  };

  const isOwner = useRef(userId === team?.ownerUserId);

  if (!team || isLoading) {
    return <p>Loading...</p>;
  }

  const getWinRate = () => {
    const percentage =
      (team.matches.filter((match) => match.winner === team.id).length /
        team.matches.length) *
      100;

    return `${Math.floor(percentage)}%`;
  };

  return (
    <div className="container">
      <TeamHeading
        name={team.name}
        primaryButton={() => setAddPlayerModalOpen(true)}
        primaryButtonText="Invite Player"
        isOwner={isOwner.current}
      />

      <div className="grid grid-cols-4 gap-8 mt-5">
        <div className="col-span-4">
          <TeamPlayers
            players={team.players}
            teamBackground={ImageData.bgcolors[0]}
          />
        </div>
        <TeamStats
          stats={[
            {
              name: 'Matches',
              stat: `${
                team.matches.filter((match) => match.winner !== null).length
              }`,
            },
            {
              name: 'Win Rate',
              stat: team.matches.length >= 1 ? getWinRate() : 'No matches',
            },
            {
              name: 'Tournament Wins',
              stat: `${
                team.tournaments.filter(
                  (tournament) => tournament.tournament.winner === team.id,
                ).length
              }`,
            },
          ]}
        />
        <div className="col-span-3">
          <h3 className="text-3xl font-bold leading-6 mb-5">Recent Matches</h3>
          <div className="space-y-8">
            {team.matches.map((match) => (
              <div key={match.matchId} className="card grid grid-cols-2">
                <div className="flex flex-col flex-0 justify-between">
                  <h4 className="font-bold text-lg">{match.tournament.name}</h4>
                  <span className="text-gray-400 text-sm">
                    {dayjs(match.tournament.startDate).format('MM/DD/YY')}
                  </span>
                </div>

                <div className="grid grid-cols-3 place-items-center justify-center">
                  <div
                    className={classNames('flex justify-end w-full', {
                      'text-gray-300': match.teamScore < match.oppenentScore,
                      'text-black font-bold':
                        match.teamScore > match.oppenentScore,
                    })}
                  >
                    <span>{team.name}</span>
                  </div>
                  <div>
                    <span className="text-lg flex items-center">
                      <span
                        className={classNames('flex justify-end w-full', {
                          'text-gray-300':
                            match.teamScore < match.oppenentScore,
                          'text-black font-bold':
                            match.teamScore > match.oppenentScore,
                        })}
                      >
                        {match.teamScore}
                      </span>
                      <span className="mx-1"> : </span>
                      <span
                        className={classNames('flex justify-end w-full', {
                          'text-gray-400':
                            match.teamScore > match.oppenentScore,
                          'text-black font-bold':
                            match.teamScore < match.oppenentScore,
                        })}
                      >
                        {match.oppenentScore}
                      </span>
                    </span>
                  </div>
                  <div
                    className={classNames('flex justify-start w-full', {
                      'text-gray-300': match.teamScore > match.oppenentScore,
                      'text-black font-bold':
                        match.teamScore < match.oppenentScore,
                    })}
                  >
                    {match.opponent?.name || 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <span className="text-red-600">{error}</span>}
      {addPlayerModalisOpen && (
        <Modal
          initialFocus={cancelButton}
          setOpen={(isOpen) => setAddPlayerModalOpen(isOpen)}
          open={addPlayerModalisOpen}
        >
          <AddPlayer
            addPlayer={() => addPlayer()}
            formSubmit={searchPlayer}
            playerName={playerName}
            playerResults={playerResults}
            setPlayerName={(value: string) => setPlayerName(value)}
            error={error}
            cancelSearch={() => setPlayerResults(null)}
          />
        </Modal>
      )}
      <AnimatePresence>
        {isActive && message && (
          <Banner message={message} icon={<CheckIcon />} />
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  const userId = session ? session.user.id : null;

  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/team/${context?.params?.id}`,
  );
  const team = await request.json();
  return { props: { data: team, userId } };
}

TeamPage.Layout = Layout;
TeamPage.defaultProps = {
  userId: null,
};

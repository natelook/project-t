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
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { Banner, Button, ModalHeading } from '@components/ui';
import { CheckIcon } from '@heroicons/react/outline';
import useNotification from '@lib/hooks/useNotification';
import TeamPlayers from '@components/team/TeamPlayers';
import { ImageData } from '@nouns/assets';
import MatchCard from '@components/team/MatchCard';
import { UploadIcon } from '@heroicons/react/solid';
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

const uploadLogo = async (file: File, teamId: string) => {
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(`/api/team/${teamId}/upload-logo`, {
    method: 'POST',
    body: JSON.stringify({ fileType }),
  });
  const { post, imageUrl } = await res.json();

  const formData = new FormData();

  Object.entries({ ...post.fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  const upload = await fetch(post.url, {
    method: 'POST',
    body: formData,
  });

  if (upload.status !== 204) {
    return { error: 'Something went wrong.' };
  }
  return { image: imageUrl };
};

export default function TeamPage({ data, userId }: TeamPageProps) {
  const [playerName, setPlayerName] = useState<string>('');
  const [playerResults, setPlayerResults] = useState<null | User>();
  const [error, setError] = useState<string | null>();
  const [addPlayerModalisOpen, setAddPlayerModalOpen] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>();
  const [file, setFile] = useState<FileList | null>();
  const { isActive, message, triggerNotification } = useNotification();

  const {
    data: team,
    isLoading,
    refetch,
  } = useQuery<TeamWithCount>(`team-${data.id}`, () => fetcher(data.id), {
    initialData: data,
  });

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
        teamName: team.name,
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
        secondaryButton={() => setUploadModal(true)}
        secondaryButtonText="Upload Team Logo"
        isOwner={isOwner.current}
        image={team.logo}
      />
      <div className="grid grid-cols-4 gap-8 mt-5">
        <div className="col-span-4">
          <TeamPlayers
            teamName={team.name}
            players={team.players}
            teamBackground={ImageData.bgcolors[0]}
          />
        </div>
        <TeamStats
          stats={[
            {
              name: 'Matches',
              stat: `${
                team.matches?.filter((match) => match.winner !== null).length
              }`,
            },
            {
              name: 'Win Rate',
              stat: team.matches?.length >= 1 ? getWinRate() : 'No matches',
            },
            {
              name: 'Tournament Wins',
              stat: `${
                team.tournaments?.filter(
                  (tournament) => tournament.tournament.winner === team.id,
                ).length
              }`,
            },
          ]}
        />
        <div className="col-span-3">
          <h3 className="text-3xl font-bold leading-6 mb-5">Recent Matches</h3>
          <div className="space-y-8">
            {team.matches.length !== 0 ? (
              team.matches?.map((match) => (
                <MatchCard
                  tournamentName={match.tournament.name}
                  date={match.tournament.startDate}
                  teamName={team.name}
                  teamScore={match.teamScore}
                  opponentName={match.opponent?.name}
                  opponentScore={match.oppenentScore}
                  tournamentSlug={match.tournament.slug}
                  matchSlug={`${match.tournament.slug}/${match.matchId}`}
                />
              ))
            ) : (
              <span className="text-gray-500 p-5 block text-xl">
                {team.name} has not played any matches
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <span className="text-red-600">{error}</span>}
      {uploadModal && (
        <Modal
          initialFocus={cancelButton}
          setOpen={(isOpen) => setAddPlayerModalOpen(isOpen)}
          open={uploadModal}
        >
          <ModalHeading
            icon={<UploadIcon />}
            title="Upload Team Logo"
            subtext="Images must be square, it is recommended that you upload a PNG that is 500x500."
          />
          <div>
            <form
              onSubmit={async (e: FormEvent) => {
                e.preventDefault();
                if (file) {
                  const upload = await uploadLogo(file[0], team.id);
                  if (upload?.error) {
                    setUploadError(upload.error);
                  } else {
                    setUploadModal(false);
                    refetch();
                  }
                }
              }}
            >
              <div className="py-8 flex justify-center">
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFile(e.target.files)
                  }
                  accept="image/png"
                />
              </div>
              {uploadError && (
                <span className="text-danger">{uploadError}</span>
              )}
              <div className="flex space-x-5">
                <Button
                  type="button"
                  label="Cancel"
                  style="secondary"
                  onClick={() => setUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" label="Upload">
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
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

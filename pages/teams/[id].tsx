import { AddPlayer, TeamHeading, TeamPanel, TeamStats } from '@components/team';
import { Layout } from '@components/common';
import Modal from '@components/ui/Modal';
import { TeamWithPlayersAndOwner } from '@lib/types';
import { User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';
import { useQuery } from 'react-query';
// import { Banner } from '@components/ui';
// import { SpeakerphoneIcon } from '@heroicons/react/solid';
// import validateTeamOwner from '@lib/validateUser';

interface TeamWithCount extends TeamWithPlayersAndOwner {
  _count: number;
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
  console.log({ data });

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
  };

  const isOwner = useRef(userId === team?.ownerUserId);

  if (!team || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <TeamHeading
        name={team.name}
        primaryButton={() => setAddPlayerModalOpen(true)}
        primaryButtonText="Invite Player"
        isOwner={isOwner.current}
      />

      <TeamStats />
      <div className="grid grid-cols-4 mt-5">
        <div>
          <h3 className="text-3xl font-bold leading-6">Players</h3>
          <TeamPanel team={team} />
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
          />
        </Modal>
      )}
      {/* <Banner
        icon={<SpeakerphoneIcon />}
        message="You have successfully invited that player"
        actionText="View Profile"
        actionLink="/profile"
      /> */}
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

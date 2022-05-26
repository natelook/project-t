import AddPlayer from '@components/ui/AddPlayer';
import Layout from '@components/ui/Layout';
import Modal from '@components/ui/Modal';
import TeamHeading from '@components/ui/TeamHeading';
import TeamPanel from '@components/ui/TeamPanel';
import TeamStats from '@components/ui/TeamStats';
import { TeamWithPlayersAndOwner } from '@lib/types';
import { User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';

interface TeamPageProps {
  team: TeamWithPlayersAndOwner;
  userId?: string;
}

export default function TeamPage({ team, userId }: TeamPageProps) {
  const [playerName, setPlayerName] = useState<string>('');
  const [playerResults, setPlayerResults] = useState<null | User>();
  const [error, setError] = useState<string | null>();
  const [addPlayerModalisOpen, setAddPlayerModalOpen] = useState(false);

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
    if (!playerResults) return;
    const request = await fetch('/api/team/add-player', {
      method: 'POST',
      body: JSON.stringify({
        teamId: team.id,
        playerId: playerResults.id,
        owner: team.ownerUserId,
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

  const isOwner = useRef(userId === team.ownerUserId);

  return (
    <div className="container mt-16">
      <div className="mb-10">
        <TeamHeading
          team={team}
          primaryButton={() => setAddPlayerModalOpen(true)}
          isOwner={isOwner}
        />
      </div>
      <TeamStats />
      <div className="grid grid-cols-4">
        <div>
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
          />
        </Modal>
      )}
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
  return { props: { team, userId } };
}

TeamPage.Layout = Layout;
TeamPage.defaultProps = {
  userId: null,
};

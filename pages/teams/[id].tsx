import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Layout from '@components/ui/Layout';
import { Team, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

interface TeamWithPlayers extends Team {
  players: User[];
}

interface TeamPageProps {
  team: TeamWithPlayers;
}

export default function TeamPage({ team }: TeamPageProps) {
  const [playerName, setPlayerName] = useState<string>('');
  const [playerResults, setPlayerResults] = useState<null | User>();
  const [error, setError] = useState<string | null>();

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
      body: JSON.stringify({ teamId: team.id, playerId: playerResults.id }),
    });
    if (request.status !== 200) setError('Something went wrong.');
  };
  return (
    <div className="container prose">
      <h1>{team.name}</h1>
      <h2>Players</h2>
      <ul>
        {team.players.map((player) => (
          <li>{player.name}</li>
        ))}
      </ul>
      <form onSubmit={searchPlayer}>
        <div className="flex">
          <Input
            id="playerLookup"
            label="Look up user"
            // @ts-ignore
            onChange={(value: string) => setPlayerName(value)}
            hideLabel
            name="playerLookup"
            value={playerName}
          />
          <Button
            label="Search Player"
            type="submit"
            onClick={() => console.log('fix this')}
            size="text-sm"
          >
            Search
          </Button>
        </div>
      </form>
      {playerResults && (
        <div>
          <div className="flex space-x-3 py-5 mt-10">
            {playerResults.image && (
              <Image
                src={playerResults.image}
                height="30px"
                width="30px"
                alt={`${playerResults.name}'s profile picture`}
                className="rounded-full"
              />
            )}
            <span className="text-xl font-bold">{playerResults.name}</span>
          </div>
          <Button label="Add Player" onClick={() => addPlayer()} size="text-sm">
            Add Player
          </Button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/team/${context?.params?.id}`,
  );
  const team = await request.json();
  return { props: { team } };
}

TeamPage.Layout = Layout;

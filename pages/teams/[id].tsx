import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Layout from '@components/ui/Layout';
import { Team, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

interface TeamWithPlayersAndOwner extends Team {
  players: User[];
  owner: User;
}

interface TeamPageProps {
  team: TeamWithPlayersAndOwner;
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
  console.log({ team });
  return (
    <div className="container max-w-2xl mt-24">
      <h1 className="text-4xl">{team.name}</h1>
      <Link href={`/player/${team.owner.id}`}>
        <a className="text-black text-xs uppercase">
          Owner - {team.owner.name}
        </a>
      </Link>
      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-2xl mt-3">Players</h2>
          <ul>
            {team.players.map((player) => (
              <li className="mt-3">
                <Link href={`/player/${player.id}`}>
                  <a>
                    <div className="flex items-center space-x-3 px-1 py-1">
                      {player.image && (
                        <Image
                          src={player.image}
                          height="30px"
                          width="30px"
                          alt={`${player.name}'s profile picture`}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-lg text-black font-normal">
                        {player.name}
                      </span>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mt-3">Add Player</h2>
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
              <Button
                label="Add Player"
                onClick={() => addPlayer()}
                size="text-sm"
              >
                Add Player
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && <span className="text-red-600">Error: {error}</span>}
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

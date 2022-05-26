import { User } from '@prisma/client';
import Image from 'next/image';
import { FormEvent } from 'react';
import Button from './Button';
import Input from './Input';

interface AddPlayerProps {
  playerName: string;
  playerResults?: User | null;
  formSubmit: (e: FormEvent) => void;
  setPlayerName: (value: string) => void;
  addPlayer: () => void;
}

export default function AddPlayer({
  formSubmit,
  playerName,
  setPlayerName,
  playerResults,
  addPlayer,
}: AddPlayerProps) {
  return (
    <div>
      <h2 className="text-2xl mt-3">Add Player</h2>
      <form onSubmit={formSubmit}>
        <div className="flex">
          <Input
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
            <Image
              src={playerResults.image || '/default-profile-pic.svg'}
              height="30px"
              width="30px"
              alt={`${playerResults.name}'s profile picture`}
              className="rounded-full"
            />
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

AddPlayer.defaultProps = {
  playerResults: null,
};

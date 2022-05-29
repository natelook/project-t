import { UserGroupIcon } from '@heroicons/react/solid';
import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';
import { FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AddPlayerProps {
  playerName: string;
  playerResults?: User | null;
  error?: string | null;
  formSubmit: (e: FormEvent) => void;
  setPlayerName: (value: string) => void;
  addPlayer: () => void;
  cancelSearch: () => void;
}

export default function AddPlayer({
  formSubmit,
  playerName,
  setPlayerName,
  playerResults,
  error,
  addPlayer,
  cancelSearch,
}: AddPlayerProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="w-12 h-12 mx-auto">
          <UserGroupIcon />
        </div>
        <h3 className="text-xl font-bold text-center">Invite Player</h3>
        <p className="px-2 text-center text-sm">
          Look up user by user name and invite them to be on your team. Note,
          invitations do not expire.
        </p>
      </div>
      {!playerResults ? (
        <form onSubmit={formSubmit}>
          <div className="space-y-3">
            <Input
              label="Look up user"
              // @ts-ignore
              onChange={(value: string) => setPlayerName(value)}
              hideLabel
              name="playerLookup"
              value={playerName}
            />
            <Button label="Search Player" type="submit" onClick={() => {}}>
              Search
            </Button>
          </div>
          {error && <span className="text-red-500 uppercase">{error}</span>}
        </form>
      ) : (
        <div className="py-3">
          <div className="flex w-full justify-center items-center space-x-3">
            <Image
              src={
                playerResults.pfp ? pfp(playerResults.pfp) : '/default-pfp.png'
              }
              height="40px"
              width="40px"
              alt={`${playerResults.name}'s profile picture`}
              className="rounded-full"
            />
            <span className="text-xl font-bold">{playerResults.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 mt-3">
            <Button label="Add Player" style="secondary" onClick={cancelSearch}>
              Search Again
            </Button>
            <Button label="Add Player" onClick={() => addPlayer()}>
              Invite Player
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

AddPlayer.defaultProps = {
  playerResults: null,
  error: null,
};

import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';
import { ChangeEvent } from 'react';

interface PlayerSelectProps {
  players: User[];
  requiredPlayers: number;
  selected: number;
  addPlayer: (playerId: string) => void;
  removePlayer: (playerId: string) => void;
}

export default function PlayerSelect({
  players,
  requiredPlayers,
  selected,
  addPlayer,
  removePlayer,
}: PlayerSelectProps) {
  return (
    <fieldset className="mt-5">
      <legend className="text-lg font-medium text-white">
        Players{' '}
        <span className="text-xs uppercase text-gray-500">
          {selected}/{requiredPlayers}
        </span>
      </legend>
      <div className="mt-4 border-t border-b border-gray-600 divide-y">
        {players.map((player) => (
          <div key={player.id} className="relative flex items-start py-4">
            <div className="min-w-0 flex-1 text-sm">
              <label
                htmlFor={`player-${player.id}`}
                className="font-medium text-gray-300 select-none flex space-x-3"
              >
                <Image
                  src={player.pfp ? pfp(player.pfp) : 'default-pfp.png'}
                  height="20px"
                  width="20px"
                  className="rounded-full"
                  alt={`${player.name}'s pfp`}
                />
                <span>{player.username}</span>
              </label>
            </div>
            <div className="ml-3 flex items-center h-5">
              <input
                id={`player-${player.id}`}
                name={`player-${player.id}`}
                type="checkbox"
                className="focus:ring-primary-opaque h-4 w-4 text-primary border-gray-600 rounded"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  e.target.checked
                    ? addPlayer(player.id)
                    : removePlayer(player.id)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

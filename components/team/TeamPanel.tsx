import pfp from '@lib/pfp';
import { TeamWithPlayersAndOwner } from '@lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface TeamPanelProps {
  team: TeamWithPlayersAndOwner;
}

export default function TeamPanel({ team }: TeamPanelProps) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
      {team.players.length !== 0 ? (
        team.players.map((player) => (
          <li key={player.id}>
            <Link href={`/player/${player.id}`}>
              <a className="py-4 flex items-center">
                <Image
                  className="h-10 w-10 rounded-full"
                  src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
                  height="40px"
                  width="40px"
                  alt=""
                />
                <div className="ml-3">
                  <p className="text-md font-medium text-gray-900 dark:text-white">
                    {player.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Matches 0
                  </p>
                </div>
              </a>
            </Link>
          </li>
        ))
      ) : (
        <p className="mt-3 p-2 text-gray-500">No players</p>
      )}
    </ul>
  );
}

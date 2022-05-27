import { TeamWithPlayersAndOwner } from '@lib/types';
import Image from 'next/image';

interface TeamPanelProps {
  team: TeamWithPlayersAndOwner;
}

export default function TeamPanel({ team }: TeamPanelProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {team.players.map((player) => (
        <li key={player.id} className="py-4 flex">
          <Image
            className="h-10 w-10 rounded-full"
            src="/default-profile-pic.svg"
            height="40px"
            width="40px"
            alt=""
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {player.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Something else
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

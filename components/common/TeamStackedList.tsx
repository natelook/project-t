import { TeamWithPlayersAndOwner } from '@lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface TeamPanelProps {
  team: TeamWithPlayersAndOwner[];
}

export default function TeamStackedList({ team }: TeamPanelProps) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
      {team.length !== 0 ? (
        team.map((t) => (
          <li key={t.id}>
            <Link href={`/teams/${t.id}`}>
              <a className="py-4 flex">
                <Image
                  className="h-10 w-10 rounded-full"
                  src="/default-pfp.png"
                  height="40px"
                  width="40px"
                  alt=""
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Players {t.players.length}
                  </p>
                </div>
              </a>
            </Link>
          </li>
        ))
      ) : (
        <p className="mt-3 p-2 text-gray-500">No Team</p>
      )}
    </ul>
  );
}

/* This example requires Tailwind CSS v2.0+ */
import { EyeIcon } from '@heroicons/react/outline';
import { TeamWithPlayers } from '@lib/types';
import Link from 'next/link';

interface TeamCardProps {
  team: TeamWithPlayers;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <li className="col-span-1 flex flex-col text-center bg-white dark:bg-gray-700 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-800">
      <div className="flex flex-col pb-4">
        <div className="relative w-full h-32 bg-gray-900 dark:bg-blue-900 dark:bg-opacity-50 border-b border-gray-200 overflow-hidden rounded-tl rounded-tr flex justify-center items-center">
          <code className="text-gray-400 uppercase">Team Image</code>
        </div>

        <div className="mt-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold">
            {team.name}
          </h3>
          <span className="font-bold text-xs uppercase text-gray-400 dark:text-gray-300">
            Total Players {team.players.length}
          </span>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <Link href={`/teams/${team.id}`}>
              <a className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 dark:text-white font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                <EyeIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                <span className="ml-3">View Team</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

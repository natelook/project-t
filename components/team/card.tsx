/* This example requires Tailwind CSS v2.0+ */
import { EyeIcon } from '@heroicons/react/outline';
import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface TeamCardProps {
  title: string;
  subtitle?: string | ReactNode;
  slug: string;
  name: 'Team' | 'Player' | 'Tournament';
  players?: User[];
}

export default function TeamCard({
  title,
  subtitle,
  slug,
  name,
  players,
}: TeamCardProps) {
  return (
    <li className="col-span-1 flex flex-col text-center bg-white dark:bg-gray-700 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-800">
      <div className="flex flex-col pb-4">
        <div className="relative w-full h-32 overflow-hidden rounded-tl rounded-tr border-gray-200">
          {!players ? (
            <div className=" bg-zinc-500 h-full dark:bg-blue-900 dark:bg-opacity-50 border-b flex justify-center items-center">
              <code className="text-black opacity-20 uppercase">
                Tournament Banner
              </code>
            </div>
          ) : (
            <div className="flex items-end mx-auto h-full bg-[#d5d7e1] px-2">
              <div className="flex justify-evenly w-full">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-pink-50 relative h-12 w-12 z-10"
                  >
                    <Image
                      src={player.pfp ? pfp(player?.pfp) : '/default-pfp.png'}
                      height="40px"
                      width="40px"
                      alt={`${player.username}'s `}
                      layout="responsive"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold">
            {title}
          </h3>
          {subtitle && (
            <span className="font-bold text-xs uppercase text-gray-400 dark:text-gray-300">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <Link href={slug}>
              <a className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 dark:text-white font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                <EyeIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                <span className="ml-3">View {name}</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

TeamCard.defaultProps = {
  subtitle: null,
  players: null,
};

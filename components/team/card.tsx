/* This example requires Tailwind CSS v2.0+ */
import { EyeIcon } from '@heroicons/react/outline';
import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

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
  const [hovered, setHovered] = useState<number | null>();
  const [playerName, setPlayerName] = useState<string | null>('');
  return (
    <li className="col-span-1 flex flex-col text-center bg-gray-700 rounded-lg divide-y divide-gray-600 ">
      <div className="flex flex-col pb-4">
        <div className="relative w-full h-32 overflow-hidden rounded-tl rounded-tr border-gray-600">
          <div className="bg-[#d5d7e1] flex flex-col justify-between h-full">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold pt-3">
              {title}
            </h3>
            <span className="text-gray-700">{playerName}</span>

            <div className="flex items-end mx-auto px-2">
              <div className="flex justify-evenly items-end w-full relative h-full">
                {players?.slice(0, 5).map((player, i) => (
                  <motion.div
                    className="relative h-12 w-12 z-10"
                    onMouseEnter={() => {
                      setHovered(i);
                      setPlayerName(player.username);
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      setPlayerName('');
                    }}
                    animate={{ y: i === hovered ? -5 : 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Link href={`/player/${player.username}`}>
                      <a>
                        <Image
                          src={
                            player.pfp ? pfp(player?.pfp) : '/default-pfp.png'
                          }
                          height="40px"
                          width="40px"
                          alt={`${player.username}'s `}
                          layout="responsive"
                        />
                      </a>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
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
              <a className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent rounded-br-lg hover:text-gray-500">
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

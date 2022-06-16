import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';

interface TeamPlayersProps {
  players: User[];
  teamBackground: string;
  teamName: string;
}

export default function TeamPlayers({
  players,
  teamBackground,
  teamName,
}: TeamPlayersProps) {
  return (
    <div
      style={{ backgroundColor: `#${teamBackground}` }}
      className="pt-10 flex justify-center rounded relative"
    >
      <p className="absolute top-2 left-2 text-gray-900 text-3xl font-bold">
        {teamName}&apos;s Players
      </p>
      <div className="flex justify-between items-end w-full max-w-3xl">
        {players?.map((player) => (
          <div key={player.id}>
            <p className="text-gray-700 text-center text-lg">
              {player.username}
            </p>
            <div className="w-36 h-36">
              <Image
                src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
                height="100px"
                width="100px"
                layout="responsive"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

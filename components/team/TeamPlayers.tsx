import pfp from '@lib/pfp';
import { User } from '@prisma/client';
import Image from 'next/image';

interface TeamPlayersProps {
  players: User[];
  teamBackground: string;
}

export default function TeamPlayers({
  players,
  teamBackground,
}: TeamPlayersProps) {
  return (
    <div
      style={{ backgroundColor: `#${teamBackground}` }}
      className="pt-10 flex justify-center rounded"
    >
      <div className="flex justify-between items-end w-full max-w-3xl">
        {players?.map((player) => (
          <div className="w-36 h-36" key={player.id}>
            <Image
              src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
              height="100px"
              width="100px"
              layout="responsive"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

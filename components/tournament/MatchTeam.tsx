import type { TeamWithPlayersAndOwner } from '@lib/types';
import Image from 'next/image';
import Link from 'next/link';
import pfp from '@lib/pfp';
import classNames from 'classnames';

interface TeamProps {
  team: TeamWithPlayersAndOwner;
  score: number;
  winner?: string;
}

function MatchTeam({ team, score, winner }: TeamProps) {
  return (
    <div
      className={classNames('space-y-8', {
        'text-success': winner && winner === team.id,
        'text-gray-600': winner && winner !== team.id,
      })}
    >
      <Link href={`/teams/${team.id}`}>
        <a>
          <h4 className="text-5xl font-bold text-center">{team.name}</h4>
        </a>
      </Link>
      <span className="block text-center text-7xl">{score}</span>
      <div className="flex justify-between bg-nouns-bg px-10 pt-5 rounded">
        {team?.players.map((player) => (
          <div key={player.id} className="w-20 h-20">
            <Image
              src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
              layout="responsive"
              height={50}
              width={50}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchTeam;

MatchTeam.defaultProps = {
  winner: undefined,
};

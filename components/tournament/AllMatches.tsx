import { MatchWithTeam } from '@lib/types';
import classNames from 'classnames';
import Link from 'next/link';

interface AllMatchesProps {
  matches: MatchWithTeam[];
  rounds: number[] | null;
  slug: string;
}

interface TeamProps {
  name?: string | null;
  score?: number;
  winner?: boolean;
}

function Team({ name, score, winner }: TeamProps) {
  return (
    <div
      className={classNames('flex justify-between py-1 px-2', {
        'bg-green-200 bg-opacity-40': winner,
      })}
    >
      <span>{name}</span>
      <span>{score}</span>
    </div>
  );
}

Team.defaultProps = {
  name: '',
  score: 0,
  winner: false,
};

function BracketMatch({ match, slug }: { match: MatchWithTeam; slug: string }) {
  return (
    <div key={match.matchId}>
      <Link href={`/${slug}/${match.matchId}`}>
        <a>
          <div className="border rounded w-52 relative">
            <div>
              <Team
                name={match.teamOne?.name}
                score={match.teamOneScore}
                winner={
                  match.winner !== null && match.winner === match.teamOneId
                }
              />
              <div className="border-b w-full" />
              <Team
                name={match.teamTwo?.name}
                score={match.teamTwoScore}
                winner={
                  match.winner !== null && match.winner === match.teamTwoId
                }
              />
            </div>
          </div>
        </a>
      </Link>
      <div className="-mt-1.5 text-right">
        <span className="uppercase text-gray-400 font-bold text-xs">
          Match {match.matchId}
        </span>
      </div>
    </div>
  );
}

export default function AllMatches({ matches, rounds, slug }: AllMatchesProps) {
  const roundName = (roundNumber: number, roundArray: number[]) => {
    if (roundArray.length === roundNumber) {
      return 'Final Match';
    }

    if (roundArray.length - 1 === roundNumber) {
      return 'Semi-Finals';
    }

    if (roundArray.length - 2 === roundNumber) {
      return 'Quarter-Finals';
    }

    return `Round ${roundNumber}`;
  };
  return (
    <div className="flex space-x-5">
      {rounds &&
        rounds.map((round) => (
          <div>
            <h4 className="mb-2 font-bold">{roundName(round, rounds)}</h4>
            <div
              key={`round-${round}`}
              className="flex flex-col justify-around h-full space-y-5"
            >
              {matches
                .filter((match) => match.round === round)
                .map((match) => (
                  <BracketMatch key={match.matchId} match={match} slug={slug} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}

import { MatchWithTeam } from '@lib/types';
import Link from 'next/link';

interface AllMatchesProps {
  matches: MatchWithTeam[];
  rounds: number[] | null;
  slug: string;
}

function Team({ name, score }: { name?: string | null; score?: number }) {
  return (
    <div className="flex justify-between py-1 px-2">
      <span>{name}</span>
      <span>{score}</span>
    </div>
  );
}

Team.defaultProps = {
  name: '',
  score: 0,
};

function BracketMatch({ match, slug }: { match: MatchWithTeam; slug: string }) {
  return (
    <div key={match.matchId}>
      <Link href={`/${slug}/${match.matchId}`}>
        <a>
          <div className="border rounded w-52 relative">
            <div>
              <Team name={match.teamOne?.name} />
              <div className="border-b w-full" />
              <Team name={match.teamTwo?.name} />
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
  return (
    <div className="flex space-x-5">
      {rounds &&
        rounds.map((round) => (
          <div>
            <h4 className="mb-2 font-bold">Round {round}</h4>
            <div
              key={`round-${round}`}
              className="flex flex-col justify-evenly"
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

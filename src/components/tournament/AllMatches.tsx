import { CollectionIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import { MatchWithTeam } from '@lib/types';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useState } from 'react';

interface TeamProps {
  name?: string | null;
  score?: number;
  winner: string | null;
  teamId: string | null;
}

function Team({ name, score, winner, teamId }: TeamProps) {
  if (!teamId && name !== 'BYE') {
    return (
      <div className="py-2 px-3">
        <span className="text-gray-700">-</span>
      </div>
    );
  }
  return (
    <div
      className={classNames(
        'flex justify-between py-2 px-3',
        winner !== null && {
          'text-success bg-opacity-0': winner === teamId,
          'text-gray-600': winner !== teamId,
        },
      )}
    >
      <div className={classNames('flex items-center justify-between w-full')}>
        <div className="flex space-x-1 items-center">
          <span>{name}</span>
          {winner !== null && winner === teamId && (
            <span className="w-5 h-5">
              <CheckIcon />
            </span>
          )}
        </div>
        <span>{score}</span>
      </div>
    </div>
  );
}

Team.defaultProps = {
  name: '',
  score: 0,
};

function BracketMatch({ match, slug }: { match: MatchWithTeam; slug: string }) {
  const matchFormat = (score: number) => `Best of ${score + score - 1}`;

  return (
    <div key={match.matchId}>
      <Link href={`/${slug}/${match.matchId}`}>
        <a>
          <div className="border border-gray-600 rounded w-64 relative">
            <div>
              <Team
                teamId={match.teamOneId}
                name={match.teamOne?.name}
                score={match.teamOneScore}
                winner={match.winner}
              />
              <div className="border-b border-gray-600 w-full" />
              <Team
                teamId={match.teamTwoId}
                name={
                  match.winner && match.teamTwoId === null
                    ? 'BYE'
                    : match.teamTwo?.name
                }
                score={match.teamTwoScore}
                winner={match.winner}
              />
            </div>
          </div>
        </a>
      </Link>
      <div className="-mt-1 text-right mr-0.5">
        <span className="uppercase text-gray-500 text-xs">
          Match {match.matchId} | {matchFormat(match.winningScore)}
        </span>
      </div>
    </div>
  );
}

interface AllMatchesProps {
  matches: MatchWithTeam[];
  rounds: number[] | null;
  slug: string;
}

export default function AllMatches({ matches, rounds, slug }: AllMatchesProps) {
  const [isCollapsed, setCollapsed] = useState(false);

  // Round names are hidden until we can get the scroll bar on the y axis to go away

  return (
    <div>
      <div className="flex justify-end w-full mb-3">
        <button
          type="button"
          onClick={() => setCollapsed(!isCollapsed)}
          className="text-gray-500"
        >
          <span className="flex items-center space-x-1">
            <span>{!isCollapsed ? 'Collapse' : 'Uncollapse'} Matches</span>
            <CollectionIcon className="w-5 h-5" />
          </span>
        </button>
      </div>
      <div className="flex space-x-16 overflow-x-scroll relative">
        {rounds &&
          rounds.map((round) => (
            <div key={round}>
              {/* <h4 className="font-bold uppercase tracking-wide text-gray-300">
                {roundName(round, rounds)}
              </h4> */}
              <div
                key={`round-${round}`}
                className={classNames('flex flex-col space-y-12 h-full', {
                  'justify-start': isCollapsed,
                  'justify-around': !isCollapsed,
                })}
              >
                {matches
                  .filter((match) => match.round === round)
                  .map((match) => (
                    <BracketMatch
                      key={match.matchId}
                      match={match}
                      slug={slug}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

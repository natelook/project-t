import dayjs from 'dayjs';
import classNames from 'classnames';
import { CheckIcon } from '@heroicons/react/solid';
import Link from 'next/link';

interface MatchCardProps {
  tournamentName: string;
  date: Date;
  teamScore: number;
  opponentScore: number;
  teamName: string;
  opponentName: string | null;
  tournamentSlug: string;
  matchSlug: string;
}

export default function MatchCard({
  tournamentName,
  date,
  teamScore,
  opponentScore,
  teamName,
  opponentName,
  tournamentSlug,
  matchSlug,
}: MatchCardProps) {
  return (
    <div className="card grid grid-cols-2">
      <div className="flex flex-col flex-0 justify-between">
        <Link href={`/${tournamentSlug}`}>
          <a>
            <h4 className="font-bold text-lg">{tournamentName}</h4>

            <span className="text-gray-400 text-sm">
              {dayjs(date).format('MM/DD/YY')}
            </span>
          </a>
        </Link>
      </div>
      <Link href={`/${matchSlug}`}>
        <a>
          <div className="grid grid-cols-3 place-items-center justify-center">
            <div
              className={classNames('flex justify-end w-full items-center', {
                'text-gray-300': teamScore < opponentScore,
                'text-success': teamScore > opponentScore,
              })}
            >
              {teamScore > opponentScore && (
                <span className="w-5 h-5 mr-3">
                  <CheckIcon />
                </span>
              )}
              <span>{teamName}</span>
            </div>
            <div>
              <span className="text-lg flex items-center">
                <span
                  className={classNames('flex justify-end w-full', {
                    'text-gray-600': teamScore < opponentScore,
                    'text-success font-bold': teamScore > opponentScore,
                  })}
                >
                  {teamScore}
                </span>
                <span className="mx-1"> : </span>
                <span
                  className={classNames(
                    'flex justify-end w-full items-center',
                    {
                      'text-gray-600': teamScore > opponentScore,
                      'text-black font-bold': teamScore < opponentScore,
                    },
                  )}
                >
                  {opponentScore}
                </span>
              </span>
            </div>
            <div
              className={classNames('flex justify-start w-full', {
                'text-gray-600': teamScore > opponentScore,
                'text-success': teamScore < opponentScore,
              })}
            >
              {opponentName || (
                <span className="text-gray-600">Awaiting Opponent</span>
              )}
              {teamScore < opponentScore && (
                <span className="w-5 h-5 mr-3">
                  <CheckIcon />
                </span>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

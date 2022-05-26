import { TeamWithPlayersAndOwner } from '@lib/types';
import { RefObject } from 'react';

interface TeamHeadingProps {
  team: TeamWithPlayersAndOwner;
  isOwner: RefObject<boolean>;
  primaryButton?: () => void;
  secondaryButton?: () => void;
}

export default function TeamHeading({
  team,
  isOwner,
  primaryButton,
  secondaryButton,
}: TeamHeadingProps) {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {team.name}
        </h2>
      </div>
      {isOwner.current && (
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={secondaryButton}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={primaryButton}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Player
          </button>
        </div>
      )}
    </div>
  );
}

TeamHeading.defaultProps = {
  primaryButton: null,
  secondaryButton: null,
};

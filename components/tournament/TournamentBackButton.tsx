import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChevronLeftIcon } from '@heroicons/react/solid';

interface BackButtonProps {
  slug: string;
  tournamentName: string;
}

export default function TournamentBackButton({
  slug,
  tournamentName,
}: BackButtonProps) {
  return (
    <React.Fragment>
      <nav className="sm:hidden" aria-label="Back">
        <Link href={slug}>
          <a className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200">
            <ChevronLeftIcon
              className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Back
          </a>
        </Link>
      </nav>
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <Link href={slug}>
          <a className="text-sm text-gray-500 hover:text-gray-200 uppercase font-bold flex space-x-1 items-center mb-2">
            <div className="w-3 h-3">
              <ArrowLeftIcon />
            </div>
            <span>{tournamentName}</span>
          </a>
        </Link>
      </nav>
    </React.Fragment>
  );
}

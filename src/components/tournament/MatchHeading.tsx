import { Button } from '@components/ui';
import Image from 'next/image';
import React from 'react';
import TournamentBackButton from './TournamentBackButton';

interface MatchHeadingProps {
  name: string;
  subtitle?: string;
  isAuthorized?: boolean;
  secondaryButtonText?: string;
  primaryButtonText?: string;
  image?: string;
  primaryButton?: () => void;
  secondaryButton?: () => void;
  tournamentSlug: string;
  tournamentName: string;
}

export default function MatchHeading({
  name,
  subtitle,
  isAuthorized,
  secondaryButtonText,
  primaryButtonText,
  image,
  primaryButton,
  secondaryButton,
  tournamentSlug,
  tournamentName,
}: MatchHeadingProps) {
  return (
    <div>
      <TournamentBackButton
        tournamentName={tournamentName}
        slug={tournamentSlug}
      />
      <div className="md:flex md:items-center md:justify-between mb-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            {image && (
              <Image
                src={image}
                height="75px"
                width="75px"
                alt={`${name}'s logo`}
                className="rounded-full"
              />
            )}
            <h2 className="text-2xl font-bold text-white sm:text-3xl sm:truncate">
              {name}
            </h2>
          </div>
          {subtitle && <h3 className="text-gray-400">{subtitle}</h3>}
        </div>
        {isAuthorized && (
          <div className="mt-4 flex md:mt-0 md:ml-4 w-auto space-x-4">
            {secondaryButtonText && (
              <Button
                onClick={secondaryButton}
                label={secondaryButtonText}
                style="secondary"
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button label={primaryButtonText} onClick={primaryButton}>
                <span>{primaryButtonText}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

MatchHeading.defaultProps = {
  primaryButton: null,
  secondaryButton: null,
  isAuthorized: null,
  subtitle: null,
  secondaryButtonText: null,
  primaryButtonText: null,
  image: null,
};

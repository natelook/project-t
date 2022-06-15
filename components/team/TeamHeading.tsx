import { Button } from '@components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';

interface TeamHeadingProps {
  name: string;
  subtitle?: string | null;
  isOwner?: boolean;
  secondaryButtonText?: string;
  primaryButtonText?: string;
  breadcrumb?: {
    name: string;
    slug: string;
  }[];
  primaryButton?: () => void;
  secondaryButton?: () => void;
}

export default function TeamHeading({
  name,
  subtitle,
  isOwner,
  secondaryButtonText,
  primaryButtonText,
  breadcrumb,
  primaryButton,
  secondaryButton,
}: TeamHeadingProps) {
  return (
    <div>
      {breadcrumb && (
        <React.Fragment>
          <nav className="sm:hidden" aria-label="Back">
            <Link href={breadcrumb[0].slug}>
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
            <ol className="flex items-center">
              {breadcrumb.map((link, i) => (
                <li key={link.slug}>
                  <div className="flex">
                    <Link href={link.slug}>
                      <a className="text-sm font-medium text-gray-400 hover:text-gray-200">
                        {link.name}
                      </a>
                    </Link>
                    {breadcrumb.length >= 1 ||
                      (breadcrumb[i + i] && (
                        <ChevronRightIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-200 text-xs"
                          aria-hidden="true"
                        />
                      ))}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </React.Fragment>
      )}
      <div className="md:flex md:items-center md:justify-between mb-10">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-white sm:text-3xl sm:truncate">
            {name}
          </h2>
          {subtitle && <h3 className="text-gray-400">{subtitle}</h3>}
        </div>
        {isOwner && (
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

TeamHeading.defaultProps = {
  primaryButton: null,
  secondaryButton: null,
  isOwner: null,
  subtitle: null,
  secondaryButtonText: null,
  primaryButtonText: null,
  breadcrumb: null,
};

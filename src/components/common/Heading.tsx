import { ChevronLeftIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@components/ui';

interface TeamHeadingProps {
  name: string;
  subtitle?: string;
  isOwner?: boolean;
  secondaryButtonText?: string;
  primaryButtonText?: string;
  image?: string;
  breadcrumb?: {
    name: string;
    slug: string;
  }[];
  primaryButton?: () => void;
  secondaryButton?: () => void;
}

export default function Heading({
  name,
  subtitle,
  isOwner,
  secondaryButtonText,
  primaryButtonText,
  image,
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
            <ol className="flex items-center space-x-1">
              {breadcrumb.map((link, i) => (
                <li key={link.slug}>
                  <div className="flex items-center">
                    <Link href={link.slug}>
                      <a className="text-sm text-gray-500 hover:text-gray-200 uppercase font-bold flex space-x-1 items-center">
                        {link.name}
                      </a>
                    </Link>
                    {breadcrumb.length <= 1 ||
                      (breadcrumb[i + i] && (
                        <div className="ml-1">
                          <ChevronLeftIcon
                            className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-200 text-xs"
                            aria-hidden="true"
                          />
                        </div>
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

Heading.defaultProps = {
  primaryButton: null,
  secondaryButton: null,
  isOwner: null,
  subtitle: null,
  secondaryButtonText: null,
  primaryButtonText: null,
  image: null,
  breadcrumb: null,
};

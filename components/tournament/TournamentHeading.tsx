/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CogIcon,
  LocationMarkerIcon,
  PencilAltIcon,
  UserGroupIcon,
} from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@components/ui';
import { useRouter } from 'next/router';

interface TournamentHeadingProps {
  name: string;
  date: Date;
  slug: string;
  isAdmin?: boolean;
  totalRegistrants: number;
  isSignedIn: boolean;
  maxRegistrants: number;
  game: string;
  startTournament: () => void;
  register: () => void;
}

export default function TournamentHeading({
  name,
  date,
  slug,
  isAdmin,
  totalRegistrants,
  isSignedIn,
  maxRegistrants,
  game,
  startTournament,
  register,
}: TournamentHeadingProps) {
  const router = useRouter();
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="flex-1 min-w-0">
        <Link href="/tournaments">
          <a className="text-sm text-gray-500 hover:text-gray-200 uppercase font-bold flex space-x-1 items-center mb-2">
            <div className="w-3 h-3">
              <ArrowLeftIcon />
            </div>
            <span>All Tournaments</span>
          </a>
        </Link>
        <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
          {name}
        </h2>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm  text-gray-500">
            <UserGroupIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {totalRegistrants}/{maxRegistrants} Teams
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <LocationMarkerIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {game}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {dayjs(date).format('MM/DD/YY h:mma')}
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        {isAdmin && (
          <React.Fragment>
            <span className="block">
              <Button
                onClick={startTournament}
                label="Start Tournament"
                style="secondary"
              >
                <span className="flex items-center">
                  <CheckIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Start Tournament
                </span>
              </Button>
            </span>
            <span className="ml-3 block">
              <Button
                label="Tournament Settings"
                onClick={() => router.push(`${slug}/settings`)}
                style="secondary"
              >
                <span className="flex items-center">
                  <CogIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Settings
                </span>
              </Button>
            </span>
          </React.Fragment>
        )}

        <span className="block ml-3">
          <Button
            onClick={() => router.push(`/${slug}/teams`)}
            label="View Teams"
            style="secondary"
          >
            <span className="flex items-center">
              <UserGroupIcon
                className="-ml-1 mr-2 h-5 w-5"
                aria-hidden="true"
              />
              View Teams
            </span>
          </Button>
        </span>
        <span className="sm:ml-3">
          <Button
            onClick={
              isSignedIn
                ? register
                : () =>
                    signIn(undefined, {
                      callbackUrl: `${process.env.NEXTAUTH_URL}/${slug}`,
                    })
            }
            label={isSignedIn ? 'Register for Tournament' : 'Sign In'}
          >
            {isSignedIn ? (
              <span className="flex items-center">
                <PencilAltIcon
                  className="-ml-1 mr-2 h-5 w-5 text-sm"
                  aria-hidden="true"
                />
                Sign Up
              </span>
            ) : (
              'Sign In to Register'
            )}
          </Button>
        </span>

        {/* Dropdown */}
        <Menu as="div" className="ml-3 relative sm:hidden">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            More
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }: any) => (
                  <Link href="/">
                    <a
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      )}
                    >
                      Edit
                    </a>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }: any) => (
                  <Link href="/">
                    <a
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      )}
                    >
                      View
                    </a>
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

TournamentHeading.defaultProps = {
  isAdmin: false,
};

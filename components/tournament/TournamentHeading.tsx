/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CogIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilAltIcon,
} from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface TournamentHeadingProps {
  name: string;
  date: Date;
  slug: string;
  isAdmin?: boolean;
  totalRegistrants: number;
  isSignedIn: boolean;
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
  startTournament,
  register,
}: TournamentHeadingProps) {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-500 uppercase font-bold">
          Tournament
        </span>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          {name}
        </h2>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
            <BriefcaseIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
            {totalRegistrants}/32 Teams
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
            <LocationMarkerIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
            Game
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
            <CalendarIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
            {dayjs(date).format('MM/DD/YY h:ma')}
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        {isAdmin && (
          <React.Fragment>
            <span className="block">
              <button
                type="button"
                onClick={startTournament}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <CheckIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300"
                  aria-hidden="true"
                />
                Start Tournament
              </button>
            </span>
            <span className="ml-3 block">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <CogIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300"
                  aria-hidden="true"
                />
                Settings
              </button>
            </span>
          </React.Fragment>
        )}

        <span className="block ml-3">
          <Link href={`/${slug}/teams`}>
            <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              <LinkIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300"
                aria-hidden="true"
              />
              Teams
            </a>
          </Link>
        </span>
        <span className="sm:ml-3">
          <button
            type="button"
            onClick={
              isSignedIn
                ? register
                : () =>
                    signIn(undefined, {
                      callbackUrl: `${process.env.NEXTAUTH_URL}/${slug}`,
                    })
            }
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            {isSignedIn ? (
              <React.Fragment>
                <PencilAltIcon
                  className="-ml-1 mr-2 h-5 w-5 text-sm"
                  aria-hidden="true"
                />
                Sign Up
              </React.Fragment>
            ) : (
              'Sign In to Register'
            )}
          </button>
        </span>

        {/* Dropdown */}
        <Menu as="div" className="ml-3 relative sm:hidden">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            More
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-500 dark:text-gray-300"
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
                {({ active }) => (
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
                {({ active }) => (
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

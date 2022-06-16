import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useQuery } from 'react-query';
import { Button } from '@components/ui';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import pfp from '@lib/pfp';
import MoreMenu from './MoreMenu';
import NotificationMenu from './NotificationMenu';

const fetcher = async () => {
  const request = await fetch('/api/user/user-notifications');
  const notifs = await request.json();
  return notifs;
};

const navItems = [
  { name: 'Tournaments', slug: '/tournaments' },
  // { name: 'Leagues', slug: '/leagues' },
];

export default function Nav() {
  const router = useRouter();
  const { data: session } = useSession();
  const getBaseSlug = (slug: string) => slug.split('/')[1];

  const { data } = useQuery('user-notifications', fetcher);

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex-1 flex justify-center sm:items-center sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-24 h-full">
                  <Link href="/">
                    <a className="block">
                      <Image
                        src="/logo.svg"
                        alt="Logo"
                        width="96px"
                        height="50px"
                        layout="responsive"
                        priority
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="hidden sm:flex sm:space-x-5 items-center ml-5">
                {/* Current: "border-sky-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {navItems.map((item) => (
                  <Link href={item.slug} key={item.name}>
                    <a
                      className={classNames({
                        'nav-link':
                          getBaseSlug(router.pathname) !==
                          getBaseSlug(item.slug),
                        'nav-link-active':
                          getBaseSlug(router.pathname) ===
                          getBaseSlug(item.slug),
                      })}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}

                <MoreMenu />
              </div>
            </div>
            {session ? (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <NotificationMenu
                  notifications={data}
                  userId={session.user.id}
                />
                <Menu as="div" className="ml-3 relative z-20">
                  <div>
                    <Menu.Button className="rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-12 w-12 rounded-full"
                        src={
                          session.user.pfp
                            ? pfp(session.user.pfp)
                            : '/default-pfp.png'
                        }
                        height="45px"
                        width="45px"
                        alt="Your profile picture"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right1 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }: any) => (
                          <div>
                            <Link href="/profile">
                              <a
                                className={classNames(
                                  active ? 'bg-gray-700' : '',
                                  'block px-4 py-2 text-sm text-white dark:text-gray-200',
                                )}
                              >
                                Your Profile
                              </a>
                            </Link>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: any) => (
                          <div>
                            <button
                              type="button"
                              onClick={() => signOut()}
                              className={classNames(
                                active ? 'bg-gray-700' : '',
                                'block px-4 py-2 text-sm text-white dark:text-gray-200 w-full text-left',
                              )}
                            >
                              Sign out
                            </button>
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center py-3 space-x-5">
                <Button type="button" label="Login" onClick={() => signIn()}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Disclosure>
  );
}
Nav.auth = true;

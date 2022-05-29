import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import pfp from '@lib/pfp';

const navItems = [
  { name: 'Home', slug: '/' },
  { name: 'Teams', slug: '/teams' },
  { name: 'Tournaments', slug: '/tournaments' },
];

export default function Nav() {
  const router = useRouter();
  const { data: session } = useSession();
  const getBaseSlug = (slug: string) => slug.split('/')[1];

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
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
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  {/* <div>
                    <div className="-mb-3">
                      <Image
                        src="/glasses.png"
                        alt="Glasses"
                        width="35px"
                        height="13px"
                      />
                    </div>
                    <span className="text-xl font-bold font-nouns tracking-wide">
                      Tournaments.wtf
                    </span>
                  </div> */}
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
                </div>
              </div>
              {session ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <Menu as="div" className="ml-3 relative z-20">
                    <div>
                      <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={
                            session.user.pfp
                              ? pfp(session.user.pfp)
                              : '/default-pfp.png'
                          }
                          height="30px"
                          width="30px"
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
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <div>
                              <Link href="/profile">
                                <a
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 dark:bg-gray-700'
                                      : '',
                                    'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                                  )}
                                >
                                  Your Profile
                                </a>
                              </Link>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div>
                              <Link href="/settings">
                                <a
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 dark:bg-gray-700'
                                      : '',
                                    'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                                  )}
                                >
                                  Settings
                                </a>
                              </Link>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  const theme = localStorage.getItem('theme');

                                  if (!theme) {
                                    localStorage.setItem('theme', 'dark');
                                    document.documentElement.classList.add(
                                      'dark',
                                    );
                                  }
                                  if (theme === 'dark') {
                                    localStorage.setItem('theme', 'light');
                                    document.documentElement.classList.remove(
                                      'dark',
                                    );
                                  }

                                  if (theme === 'light') {
                                    localStorage.setItem('theme', 'dark');
                                    document.documentElement.classList.add(
                                      'dark',
                                    );
                                  }
                                }}
                                className={classNames(
                                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left',
                                )}
                              >
                                Toggle Darkmode
                              </button>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div>
                              <button
                                type="button"
                                onClick={() => signOut()}
                                className={classNames(
                                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                  'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left',
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
                <div className="flex items-center">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => signIn()}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {/* Current: "bg-sky-50 border-sky-500 text-sky-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="bg-sky-50 border-sky-500 text-sky-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Team
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Calendar
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
Nav.auth = true;

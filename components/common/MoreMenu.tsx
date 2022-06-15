/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

const links = [
  {
    name: 'Teams',
    href: '/teams',
  },
  {
    name: 'Leagues',
    description: 'Coming Soon',
    href: '/leagues',
  },
];

export default function MoreMenu() {
  return (
    <Popover className="relative">
      {({ open }: any) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-200' : 'text-gray-500',
              'group rounded-md flex items-center text-base font-medium hover:text-gray-200 focus:outline-none ',
            )}
          >
            <div className="h-5 w-5 flex">
              <DotsVerticalIcon />
            </div>
            <span className="sr-only">View More</span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-60 sm:px-0">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-gray-800 sm:p-4 sm:gap-8">
                  {links.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-m-3 p-3 block rounded-md hover:bg-gray-700 transition ease-in-out duration-150"
                    >
                      <p className="text-base font-medium text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-sm font-medium text-gray-500">
                        {item.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

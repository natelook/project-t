/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import classNames from 'classnames';
import { Team } from '@prisma/client';

interface SelectProps {
  label: string;
  options: Team[];
  selected: Team | null;
  setSelected: (team: Team) => void;
}

export default function TeamSelect({
  label,
  options,
  selected,
  setSelected,
}: SelectProps) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
              <span className="flex items-center">
                {selected ? (
                  <React.Fragment>
                    <Image
                      src="/default-profile-pic.svg"
                      alt=""
                      className="flex-shrink-0 h-6 w-6 rounded-full"
                      height="15px"
                      width="15px"
                    />
                    <span className="ml-3 block truncate dark:text-white">
                      {selected.name}
                    </span>
                  </React.Fragment>
                ) : (
                  <span className="ml-3 block truncate">Select a team</span>
                )}
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((team) => (
                  <Listbox.Option
                    key={team.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-sky-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      )
                    }
                    value={team}
                  >
                    {({ selected: isSelected, active }) => (
                      <>
                        <div className="flex items-center">
                          <Image
                            src="/default-profile-pic.svg"
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                            height="15px"
                            width="15px"
                          />
                          <span
                            className={classNames(
                              isSelected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate dark:text-white',
                            )}
                          >
                            {team.name}
                          </span>
                        </div>

                        {isSelected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-sky-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

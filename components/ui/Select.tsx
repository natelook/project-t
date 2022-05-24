/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import classNames from 'classnames';

const people = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 4,
    name: 'Tom Cook',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 5,
    name: 'Tanya Fox',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 6,
    name: 'Hellen Schmidt',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 7,
    name: 'Caroline Schultz',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 8,
    name: 'Mason Heaney',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 9,
    name: 'Claudie Smitham',
    avatar: '/default-profile-pic.svg',
  },
  {
    id: 10,
    name: 'Emil Schaefer',
    avatar: '/default-profile-pic.svg',
  },
];

interface SelectProps {
  label: string;
}

export default function Select({ label }: SelectProps) {
  const [selected, setSelected] = useState(people[3]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <Image
                  src={selected.avatar}
                  alt=""
                  className="flex-shrink-0 h-6 w-6 rounded-full"
                  height="15px"
                  width="15px"
                />
                <span className="ml-3 block truncate">{selected.name}</span>
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
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      )
                    }
                    value={person}
                  >
                    {({ selected: isSelected, active }) => (
                      <>
                        <div className="flex items-center">
                          <Image
                            src={person.avatar}
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                            height="15px"
                            width="15px"
                          />
                          <span
                            className={classNames(
                              isSelected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate',
                            )}
                          >
                            {person.name}
                          </span>
                        </div>

                        {isSelected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
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

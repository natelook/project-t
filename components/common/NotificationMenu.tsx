import type { Notification } from '@prisma/client';
import React, { Fragment, useCallback } from 'react';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import dayjs from 'dayjs';

interface NotificationMenuProps {
  notifications: Notification[];
  userId: string;
}

export default function NotificationMenu({
  notifications,
  userId,
}: NotificationMenuProps) {
  const readNotification = useCallback(
    (notificationId: string) => {
      fetch('/api/notification/read', {
        method: 'POST',
        body: JSON.stringify({ userId, notificationId }),
      });
    },
    [userId],
  );
  return (
    <Popover className="relative">
      {({ open }: any) => (
        <React.Fragment>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-200' : 'text-gray-500',
              'group rounded-md flex items-center text-base font-medium hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ',
            )}
          >
            <div className="relative">
              <div className="h-7 w-7 flex relative">
                <BellIcon />
              </div>
              {notifications?.filter(
                (notification) => notification.read === false,
              ).length !== 0 && (
                <span className="bg-primary text-xs text-white p-1 absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full">
                  {
                    notifications?.filter(
                      (notification) => notification.read === false,
                    ).length
                  }
                </span>
              )}
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
            <Popover.Panel className="absolute z-20 left-1/2 transform -translate-x-1/2 px-2 w-96 h-96 sm:px-0 mt-5">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative bg-gray-800 sm:p-4 h-80 overflow-scroll">
                  {notifications
                    ? notifications?.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-center border-b last:border-b-0 border-gray-700 hover:bg-gray-700 py-3 rounded-md"
                          onMouseEnter={() => readNotification(notification.id)}
                        >
                          <Link href={notification.link}>
                            <a
                              key={notification.id}
                              className="transition ease-in-out duration-150 flex items-center justify-between p-3"
                            >
                              <p className="text-base font-medium text-white text-left">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-300 uppercase block">
                                {dayjs(notification.createdAt).format(
                                  'h:mma MM/DD/YY',
                                )}
                              </span>
                            </a>
                          </Link>
                        </div>
                      ))
                    : 'No messages'}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </React.Fragment>
      )}
    </Popover>
  );
}

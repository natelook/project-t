import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { TeamInvitationWithTeam } from '@lib/types';
import Image from 'next/image';
import React from 'react';

interface TeamInvitationsProps {
  invitation: TeamInvitationWithTeam[];
  response: (answer: 'accept' | 'decline', inviteId: string) => void;
}

export default function TeamInvitations({
  invitation,
  response,
}: TeamInvitationsProps) {
  return (
    <div>
      {invitation.filter((invite) => invite.status === 'Pending').length !==
      0 ? (
        <React.Fragment>
          <div className="flow-root mt-6">
            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-600">
              {invitation
                .filter((invite) => invite.status === 'Pending')
                .map((invite) => (
                  <li key={invite.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-8 w-8 rounded-full"
                          src="/default-pfp.png"
                          height="32px"
                          width="32px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {invite.team.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {invite.team.players?.length || 0} Players
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => response('decline', invite.id)}
                          className="yes-no-button text-red-500 border-red-500"
                        >
                          <XIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => response('accept', invite.id)}
                          className="yes-no-button text-green-500 border-green-500"
                        >
                          <CheckIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-6">
            <a className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              View all
            </a>
          </div>
        </React.Fragment>
      ) : (
        <p className="mt-3 p-2 text-gray-500">No invitations</p>
      )}
    </div>
  );
}

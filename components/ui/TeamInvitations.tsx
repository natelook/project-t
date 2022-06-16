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
          <div>
            <ul>
              {invitation
                .filter((invite) => invite.status === 'Pending')
                .map((invite) => (
                  <li key={invite.id} className="card">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={invite.team.logo || '/default-pfp.png'}
                          height="40px"
                          width="40px"
                        />

                        <p className="text-white truncate">
                          {invite.team.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => response('decline', invite.id)}
                          className="yes-no-button text-danger"
                        >
                          <XIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => response('accept', invite.id)}
                          className="yes-no-button text-success"
                        >
                          <CheckIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          {/* <div className="mt-6">
            <a className="btn w-full flex justify-center">View all</a>
          </div> */}
        </React.Fragment>
      ) : (
        <p className="mt-3 p-2 text-gray-500">No invitations</p>
      )}
    </div>
  );
}

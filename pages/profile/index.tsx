import { Heading, Layout } from '@components/common';
import TeamStackedList from '@components/common/TeamStackedList';
import Playground from '@components/common/Playground';
import { Button, Input, Modal, ModalHeading } from '@components/ui';
import TeamInvitations from '@components/ui/TeamInvitations';
import { BadgeCheckIcon, CogIcon } from '@heroicons/react/solid';
import { TeamInvitationWithTeam, TeamWithPlayersAndOwner } from '@lib/types';
import { Registrant, Tournament, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import usePlayground from '@lib/hooks/usePlayground';
import { useRouter } from 'next/router';

interface UserProfile extends User {
  tournaments: Tournament[];
  teamOnTournament: Registrant[];
  teams: TeamWithPlayersAndOwner[];
  ownedTeams: TeamWithPlayersAndOwner[];
  teamInvitations: TeamInvitationWithTeam[];
}

interface ProfileProps {
  data: UserProfile;
}

const fetcher = async (userId: string) => {
  const request = await fetch(`/api/user/${userId}`);
  const data = await request.json();
  return data;
};

export default function Profile({ data }: ProfileProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [nameError, setNameError] = useState<string | null>('');
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const router = useRouter();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<UserProfile>(['user-profile', data.id], () => fetcher(data.id), {
    initialData: data,
  });

  const inviteResponse = async (
    answer: 'accept' | 'decline',
    inviteId: string,
  ) => {
    const request = await fetch('/api/team/invite-response', {
      method: 'POST',
      body: JSON.stringify({ answer, inviteId }),
    });

    if (request.status === 200) {
      refetch();
    }
  };

  const cancelButton = useRef(null);

  const changeUsername = async (e: FormEvent) => {
    e.preventDefault();
    const request = await fetch('/api/user/change-username', {
      method: 'POST',
      body: JSON.stringify({ newUsername }),
    });
    const response = await request.json();
    if (response.error) return setNameError(response.error);
    setModalOpen(false);
    refetch();
    return response;
  };
  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Heading
        name="Your Profile"
        subtitle={user.username || undefined}
        isOwner
        secondaryButton={() => router.push('/profile/settings')}
        secondaryButtonText="User Settings"
        primaryButtonText="Change Username"
        primaryButton={() => setModalOpen(true)}
      />

      <div className="grid lg:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-bold mb-2">Owned Teams</h3>
          {user?.ownedTeams && (
            <div>
              <TeamStackedList team={user.ownedTeams} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Teams</h3>
          {user?.teams && (
            <div>
              <TeamStackedList team={user.teams} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Invitations</h3>

          {user.teamInvitations.length >= 0 ? (
            <TeamInvitations
              invitation={user.teamInvitations}
              response={(answer: 'accept' | 'decline', inviteId: string) =>
                inviteResponse(answer, inviteId)
              }
            />
          ) : (
            <p className="mt-3 p-2 text-gray-500">No Invitations</p>
          )}
        </div>
      </div>
      {modalOpen && (
        <Modal
          open={modalOpen}
          setOpen={(isOpen) => setModalOpen(isOpen)}
          initialFocus={cancelButton}
        >
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto">
              <BadgeCheckIcon />
            </div>
            <h3 className="text-xl font-bold text-center">
              Update Your Username
            </h3>
            <p className="px-2 text-center text-sm">
              Please note you can update your username as many times as you
              like. If you do it 10 times your account deletes itself though.
            </p>
          </div>
          <form onSubmit={changeUsername} className="space-y-3">
            <Input
              label="New Username"
              name="username"
              onChange={(value) => setNewUsername(value)}
              value={newUsername}
              hideLabel
            />
            <Button type="submit" label="Update username" onClick={() => {}}>
              Update
            </Button>
          </form>
          {nameError && (
            <span className="text-danger block text-center mt-5">
              {nameError}
            </span>
          )}
        </Modal>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return { notFound: true };
  }
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/${session.user.id}`,
  );
  const user = await request.json();

  return { props: { data: user } };
}

Profile.Layout = Layout;

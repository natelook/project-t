import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import { Button, Input, Modal } from '@components/ui';
import TeamInvitations from '@components/ui/TeamInvitations';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { TeamInvitationWithTeam } from '@lib/types';
import { Registrant, Team, Tournament, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import { useQuery } from 'react-query';

interface UserProfile extends User {
  tournaments: Tournament[];
  teamOnTournament: Registrant[];
  teams: Team[];
  ownedTeams: Team[];
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
    setModalOpen(false);
    refetch();
    return response;
  };
  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TeamHeading
        name="Your Profile"
        subtitle={user.username}
        isOwner
        primaryButtonText="Change Username"
        primaryButton={() => setModalOpen(true)}
      />

      <div className="grid lg:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold">Owned Teams</h3>
          {user?.ownedTeams && (
            <div>
              {user?.ownedTeams.map((team) => (
                <Link href={`/teams/${team.id}`} key={team.id}>
                  <a>{team.name}</a>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold">Teams</h3>
          {user?.teams && (
            <div>
              {user?.teams.map((team) => (
                <Link href={`/teams/${team.id}`} key={team.id}>
                  <a>{team.name}</a>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold">Invitations</h3>

          {user.teamInvitations.length > 0 && (
            <TeamInvitations
              invitation={user.teamInvitations}
              response={(answer: 'accept' | 'decline', inviteId: string) =>
                inviteResponse(answer, inviteId)
              }
            />
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

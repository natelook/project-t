import { Heading, Layout } from '@components/common';
import TeamStackedList from '@components/common/TeamStackedList';
import { Button, Input, Modal } from '@components/ui';
import TeamInvitations from '@components/ui/TeamInvitations';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '@lib/trpc';
import { useForm } from 'react-hook-form';

export default function Profile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>('');
  const cancelButton = useRef(null);
  const router = useRouter();

  const { register, handleSubmit } = useForm<{ username: string }>();

  const { data: user, isLoading, refetch } = trpc.useQuery(['user']);
  const updateUsername = trpc.useMutation('changeUsername');
  const teamInviteResponse = trpc.useMutation('teamInviteResponse');

  const inviteResponse = async (
    answer: 'accept' | 'decline',
    inviteId: string,
  ) => {
    const request = await teamInviteResponse.mutateAsync({ answer, inviteId });

    if (request.message) {
      refetch();
    }
  };

  const changeUsername = async ({ username }: { username: string }) => {
    const request = await updateUsername.mutateAsync({ username });
    if (!request) return setNameError('Something bad happened');
    setModalOpen(false);
    refetch();
    return request;
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
          <form onSubmit={handleSubmit(changeUsername)} className="space-y-3">
            <Input
              label="New Username"
              name="username"
              register={register}
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

Profile.Layout = Layout;

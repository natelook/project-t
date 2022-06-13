import { Layout } from '@components/common';
import Playground from '@components/Playground';
import { Button, Input, Modal, ModalHeading } from '@components/ui';
import { UserIcon } from '@heroicons/react/solid';
import usePlayground from '@lib/hooks/usePlayground';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

async function fetcher(userId?: string) {
  if (!userId) return null;
  const request = await fetch(`/api/user/${userId}`);
  const user = await request.json();
  return user;
}

export default function SettingsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const { data: session, status } = useSession();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User>('user-settings', () => fetcher(session?.user.id));
  const router = useRouter();

  const { setNounAsPfp } = usePlayground(session?.user.id);

  useEffect(() => {
    if (user && !user.username) {
      setModalOpen(true);
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      refetch();
    }
  }, [session, refetch]);

  if (status === 'loading' || isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user found.</p>;
  }

  if (status === 'unauthenticated' || !session?.user.id) {
    return <p>Sign in to view this page</p>;
  }

  const submitProfileInfo = async () => {
    setNounAsPfp();
    const request = await fetch('/api/user/change-username', {
      method: 'POST',
      body: JSON.stringify({ newUsername }),
    });

    if (request.status === 200) {
      router.push('/profile');
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      {user.name}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          setOpen={(isOpen) => setModalOpen(isOpen)}
          width="max-w-3xl"
        >
          <ModalHeading
            title="Set Profile Information"
            subtext=""
            icon={<UserIcon />}
          />
          <div className="py-3 mb-5">
            <h3 className="text-xl font-bold mb-1">Set Your Username</h3>
            <Input
              type="text"
              onChange={(value) => setNewUsername(value)}
              value={newUsername}
              name="new-username"
              label="New Username"
            />
          </div>
          <h3 className="text-xl font-bold mb-1">Create Your PFP</h3>
          <Playground userId={session?.user.id} />
          <div className="mt-3">
            <Button
              label="Submit Profile Information"
              onClick={submitProfileInfo}
            >
              Submit
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

SettingsPage.Layout = Layout;
SettingsPage.auth = true;

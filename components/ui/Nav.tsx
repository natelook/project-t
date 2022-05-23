import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { LogoutIcon } from '@heroicons/react/solid';
import Button from './Button';

export default function Nav() {
  const { data: session } = useSession();
  if (session) {
    if (!session.user) {
      return <div>Something went wrong</div>;
    }

    return (
      <div className="flex justify-center py-1">
        <div className="space-x-10 flex items-center">
          <div className="flex justify-center items-center space-x-2">
            {session?.user.image && (
              <Image
                src={session.user.image}
                height="30px"
                width="30px"
                alt="Your profile picture"
                className="rounded-full"
              />
            )}
            <span>{session?.user.name}</span>
          </div>

          <Button
            onClick={() => signOut()}
            icon={<LogoutIcon />}
            label="Sign Out"
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center py-1">
      <Button type="button" onClick={() => signIn()} label="Sign In">
        Sign in
      </Button>
    </div>
  );
}

Nav.auth = true;

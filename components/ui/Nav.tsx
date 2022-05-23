import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { LogoutIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Button from './Button';

const NavList = [
  { name: 'Home', slug: '/' },
  { name: 'Teams', slug: '/teams' },
];

export default function Nav() {
  const { data: session } = useSession();
  if (session) {
    if (!session.user) {
      return <div>Something went wrong</div>;
    }

    return (
      <div className="flex justify-between container py-1">
        <div>
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
              size="text-sm"
            >
              Sign out
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex space-x-3 items-center">
            {NavList.map((item) => (
              <li key={item.name}>
                <Link href={item.slug}>
                  <a className="text-black">{item.name}</a>
                </Link>
              </li>
            ))}
          </ul>
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

import { Button } from '@components/ui';
import { CalendarIcon, UsersIcon } from '@heroicons/react/solid';
import randomNumber from '@lib/random-number';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface TournamentCardProps {
  name: string;
  totalPlayers: number;
  maxPlayers: number;
  slug: string;
}

export default function TournamentCard({
  name,
  totalPlayers,
  maxPlayers,
  slug,
}: TournamentCardProps) {
  const router = useRouter();
  return (
    <div className="bg-gray-700 rounded shadow shadow-gray-700">
      <Link href={`/${slug}`}>
        <a>
          <div>
            <Image
              src={`/TournamentHeader-${randomNumber(5)}.png`}
              width="258px"
              height="120px"
              alt="Tournament Image"
              layout="responsive"
              className="rounded-tl rounded-tr"
            />
          </div>
        </a>
      </Link>
      <div className="px-3 pt-2 pb-6">
        <Link href={`/${slug}`}>
          <a>
            <h3 className="text-3xl font-bold mt-2 mb-4 text-center">{name}</h3>
          </a>
        </Link>
        <div className="flex justify-evenly mb-6">
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="w-5 h-5">
              <UsersIcon />
            </div>
            <p className="tracking-wide">
              Teams {totalPlayers}/{maxPlayers}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="w-5 h-5">
              <CalendarIcon />
            </div>
            <p className="tracking-wide">{dayjs().format('MM/DD/YY h:mma')}</p>
          </div>
        </div>
        <div className="mt-3">
          <Button label="Register Page" onClick={() => router.push(slug)}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

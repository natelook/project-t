import { Team } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface TeamPanelProps {
  team: Team[];
}

export default function TeamStackedList({ team }: TeamPanelProps) {
  return (
    <ul className="space-y-3">
      {team.length !== 0 ? (
        team.map((t) => (
          <li key={t.id} className="card">
            <Link href={`/teams/${t.id}`}>
              <a className="flex items-center">
                <Image
                  className="rounded-full"
                  src={t.logo || '/no-team-logo.png'}
                  height="40px"
                  width="40px"
                  alt=""
                />
                <div className="ml-3">
                  <p className="font-medium text-white">{t.name}</p>
                </div>
              </a>
            </Link>
          </li>
        ))
      ) : (
        <p className="mt-3 p-2 text-gray-500">No Teams</p>
      )}
    </ul>
  );
}

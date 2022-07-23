import TeamStackedList from '@components/common/TeamStackedList';
import { TournamentWithRegistrants } from '@lib/types';
import Image from 'next/image';

interface InfoProps {
  tournament: TournamentWithRegistrants;
  output: string;
}

export default function Info({ tournament, output }: InfoProps) {
  return (
    <div className="grid grid-cols-4 gap-x-10 ">
      <div className="col-span-3">
        <h3 className="text-2xl font-bold mb-5">
          Tournament Rules and Information
        </h3>
        <div className="bg-gray-800 rounded-lg p-10 shadow shadow-gray-700">
          {tournament.banner && (
            <div className="mb-5">
              <Image
                src={tournament.banner}
                width="258px"
                height="120px"
                alt="Tournament Image"
                layout="responsive"
                className="rounded"
              />
            </div>
          )}
          {tournament.description ? (
            <div className="prose-invert prose w-full max-w-full">
              {/* eslint-disable-next-line */}
              <div dangerouslySetInnerHTML={{ __html: output }} />
            </div>
          ) : (
            <p className="text-gray-600">No description</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-5">Registered Teams</h3>
        <TeamStackedList
          team={tournament.registrants.map((reg) => ({ ...reg.team }))}
        />
      </div>
    </div>
  );
}

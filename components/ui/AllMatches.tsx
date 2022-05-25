import { Match } from '@prisma/client';
import { useEffect } from 'react';

interface AllMatchesProps {
  matches: Match[];
  rounds: number[] | null;
}

export default function AllMatches({ matches, rounds }: AllMatchesProps) {
  console.log({ matches });
  return (
    <div>
      {rounds &&
        rounds.map((round) => (
          <div key={`round-${round}`}>
            <h3 className="text-xl font-bold my-4">Round {round}</h3>
            <div className="grid grid-cols-2 gap-4">
              {matches
                .filter((match) => match.round === round)
                .map((match) => (
                  <div
                    key={match.id}
                    className="border rounded p-3 flex justify-center items-center"
                  >
                    <div>
                      <p>{match.id}</p>
                      <div className="display grid grid-cols-2 ">
                        <div className="flex flex-col">
                          <span>Team 1</span>
                          <span>{match.teamOneId}</span>
                        </div>
                        <div className="flex flex-col">
                          <span>Team 2</span>
                          <span>{match.teamTwoId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}

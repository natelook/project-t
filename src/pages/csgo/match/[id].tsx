import React, { ChangeEvent, useCallback } from 'react';
import { Layout } from '@components/common';
import { Button } from '@components/ui';
import useSetupMatch, { createMatchServer } from '@lib/hooks/useSetupCSMatch';
import classNames from 'classnames';
import { trpc } from '@lib/trpc';
import { Maps } from '@lib/types/csgo';
import { useRouter } from 'next/router';

// Get match ID from serverside props to elimate re-renders by using useRouter()
export default function MatchPage() {
  const [team1PlayerId, setTeam1PlayerId] = React.useState<string>('');
  const [team2PlayerId, setTeam2PlayerId] = React.useState<string>('');

  const addPlayer = trpc.useMutation('addPlayerToCsgoMatch');
  const veto = trpc.useMutation('csgoVeto');
  const router = useRouter();

  const { data } = trpc.useQuery([
    'csgoMatch',
    { matchId: router.query?.id as string },
  ]);

  const { match } = useSetupMatch(router.query.id as string);

  const vetoMap = useCallback(
    async (
      vetoedMap: string,
      currentVote: Maps,
      team1Players?: string[],
      team2Players?: string[],
      // eslint-disable-next-line
    ) => {
      const matchId = router.query?.id as string;
      const mapsLeft = Object.entries(currentVote).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, active]) => active && true,
      ).length;

      if (mapsLeft === 1) {
        return 'You cannot veto the last map';
      }

      const updatedMaps = { ...currentVote, [vetoedMap]: false };

      if (mapsLeft === 2) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const map = Object.entries(updatedMaps).find(([_, active]) => active);
        if (!map) throw Error('Something went wrong when selecting a map.');
        // @ts-ignore
        await veto.mutateAsync({ matchId, updatedMaps, map: map[0] });
        createMatchServer(map[0], matchId, team1Players, team2Players);
      }
      // @ts-ignore
      veto.mutate({ matchId, updatedMaps });
    },
    [veto],
  );

  if (!data?.match) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-end space-x-3">
        <h1 className="text-3xl">Match: {data.match.id}</h1>
        <a
          href="https://steamid.io/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary-lighter uppercase"
        >
          Find steam Id
        </a>
      </div>
      <div className="grid grid-cols-3">
        <div>
          <h2>Team 1: {data.match.team1Score}</h2>
          {data.match.team1Players?.map((player) => (
            <div key={player}>{player}</div>
          ))}
          <div className="flex">
            <input
              className="input"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTeam1PlayerId(e.target.value)
              }
              placeholder="Add Steam ID (ex STEAM_1:0:445790386)"
            />
            <Button
              label="add player"
              onClick={() =>
                addPlayer.mutate({
                  matchId,
                  playerId: team1PlayerId,
                  team: '1',
                })
              }
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="space-y-3">
            {!data.match.map && data?.match.maps ? (
              Object.entries(data.match.maps).map(([name, active]) => (
                <div
                  key={name}
                  className={classNames('bg-gray-800 px-6 py-3 text-center', {
                    'text-gray-700': !active,
                    'text-white': active,
                  })}
                >
                  <button
                    type="button"
                    onClick={() => {
                      vetoMap(
                        name,
                        data.match.maps,
                        data.match?.team1Players,
                        data.match?.team2Players,
                      );
                    }}
                  >
                    {name}
                  </button>
                </div>
              ))
            ) : (
              <React.Fragment>
                <p>{data.match.map}</p>
                {data.match.ip ? (
                  <p>{data.match.ip}</p>
                ) : (
                  <p>Creating server...</p>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
        <div>
          <h2>Team 2: {data.match.team2Score}</h2>
          {data.match.team2Players?.map((player) => (
            <div key={player}>{player}</div>
          ))}
          <div className="flex">
            <input
              type="text"
              className="input"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTeam2PlayerId(e.target.value)
              }
              placeholder="Add Steam ID (ex STEAM_1:0:445790386)"
            />
            <Button
              label="add player"
              onClick={() =>
                addPlayer.mutate({
                  matchId,
                  playerId: team2PlayerId,
                  team: '2',
                })
              }
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

MatchPage.Layout = Layout;

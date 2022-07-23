import React, { ChangeEvent, useCallback } from 'react';
import { Layout } from '@components/common';
import { Button } from '@components/ui';
import useSetupMatch, { veto } from '@lib/hooks/useSetupCSMatch';
import supabase from '@lib/supabase';
import classNames from 'classnames';
import { GetServerSidePropsContext } from 'next';

// Get match ID from serverside props to elimate re-renders by using useRouter()
export default function MatchPage({ matchId }: { matchId: string }) {
  const [team1PlayerId, setTeam1PlayerId] = React.useState<string>('');
  const [team2PlayerId, setTeam2PlayerId] = React.useState<string>('');

  const { match } = useSetupMatch(matchId);

  const addPlayer = useCallback(
    async (steamId: string, team: 1 | 2) => {
      if (team === 1) {
        const updatedTeam = match.team1Players
          ? match.team1Players.concat([steamId])
          : [steamId];
        await supabase
          .from('CSGOMatch')
          .update({ team1Players: updatedTeam })
          .match({ id: match.id });
        setTeam1PlayerId('');
      } else {
        const updatedTeam = match.team2Players
          ? match.team2Players.concat([steamId])
          : [steamId];
        await supabase
          .from('CSGOMatch')
          .update({ team2Players: updatedTeam })
          .match({ id: match.id });
        setTeam2PlayerId('');
      }
    },
    [match],
  );

  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-end space-x-3">
        <h1 className="text-3xl">Match: {match.id}</h1>
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
          <h2>Team 1: {match.team1Score}</h2>
          {match.team1Players?.map((player) => (
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
              onClick={() => addPlayer(team1PlayerId, 1)}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="space-y-3">
            {!match.map ? (
              Object.entries(match.maps).map(([name, active]) => (
                <div
                  key={name}
                  className={classNames('bg-gray-800 px-6 py-3 text-center', {
                    'text-gray-700': !active,
                    'text-white': active,
                  })}
                >
                  <button
                    type="button"
                    onClick={() =>
                      veto(
                        match.id,
                        name,
                        match.maps,
                        match.team1Players,
                        match.team2Players,
                      )
                    }
                  >
                    {name}
                  </button>
                </div>
              ))
            ) : (
              <React.Fragment>
                <p>{match.map}</p>
                {match.ip ? <p>{match.ip}</p> : <p>Creating server...</p>}
              </React.Fragment>
            )}
          </div>
        </div>
        <div>
          <h2>Team 2: {match.team2Score}</h2>
          {match.team2Players?.map((player) => (
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
              onClick={() => addPlayer(team2PlayerId, 2)}
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

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      matchId: query.id,
    },
  };
}

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Maps, Match } from '@lib/types/csgo';
import supabase from '@lib/supabase';

const fetchMatch = async (
  id: string,
  setState?: Dispatch<SetStateAction<Match | null | undefined>>,
): Promise<Match> => {
  const match = await supabase.from('CSGOMatch').select('*').match({ id });
  if (!match.body) return null;

  if (setState) setState(match.body[0]);

  return match.body[0];
};

export default function useSetupMatch(matchId: string) {
  const [match, setMatch] = useState<Match | null>();
  const [matchUpdate, handleMatchUpdate] = useState<Match | null>(null);

  useEffect(() => {
    fetchMatch(matchId, setMatch);

    const matchListener = supabase
      .from(`CSGOMatch:id=eq.${matchId}`)
      .on('UPDATE', (payload) => handleMatchUpdate(payload.new))
      .subscribe();

    return () => {
      matchListener.unsubscribe();
    };
  }, [matchId]);

  // Handle updates from Match including vetos
  useEffect(() => {
    const handleAsync = async () => {
      if (!match || !matchUpdate) return;
      setMatch(matchUpdate);
    };
    handleAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchUpdate]);

  return { match };
}

export const createMatchServer = async (
  map: string,
  matchId: string,
  team1Players?: string[],
  team2Players?: string[],
) => {
  await fetch('/api/csgo/create-match-server', {
    method: 'POST',
    body: JSON.stringify({ matchId, map, team1Players, team2Players }),
  });
};

export const veto = async (
  matchId: string,
  vetoedMap: string,
  currentVote: Maps,
  team1Players?: string[],
  team2Players?: string[],
) => {
  const mapsLeft = Object.entries(currentVote).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, active]) => active && true,
  ).length;

  if (mapsLeft === 1) {
    return 'You cannot veto the last map';
  }

  const updatedVetos = { ...currentVote, [vetoedMap]: false };

  if (mapsLeft === 2) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = Object.entries(updatedVetos).find(([_, active]) => active);
    if (!map) throw Error('Something went wrong when selecting a map.');
    const data = supabase
      .from('CSGOMatch')
      .update({ map: map[0], maps: updatedVetos })
      .match({ id: matchId });
    createMatchServer(map[0], matchId, team1Players, team2Players);
    return data;
  }
  const data = supabase
    .from('CSGOMatch')
    .update({ maps: updatedVetos })
    .match({ id: matchId });
  return data;
};

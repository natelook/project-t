import supabase from '@lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const match = req.body;

  if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION) {
    return res.status(403).end();
  }

  await supabase
    .from('match')
    .update({
      team1Score: match.team1_stats.score,
      team2Score: match.team2_stats.score,
      playerStats: match.player_stats,
      started: match.started,
      finished: match.finished,
      roundsPlayed: match.rounds_played,
    })
    .match({ serverMatchId: match.game_server_id });

  return res.status(200).json({ message: 'Match updated' });
}

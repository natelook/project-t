import { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import prisma from '@lib/prisma';

const createServer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { matchId, map, team1Players, team2Players } = JSON.parse(req.body);

  const headers = {
    authorization: `Basic ${Buffer.from(
      `${process.env.DAT_HOST_USER}:${process.env.DAT_HOST_PASSWORD}`,
    ).toString('base64')}`,
  };

  const body = new FormData();
  body.append('name', 'Match Room LA - tournaments.wtf');
  body.append('game', 'csgo');
  body.append('csgo_settings.rcon', 'test');
  body.append(
    'csgo_settings.steam_game_server_login_token',
    '22C30DFFFAE9CEA44D7D6B3C70419927',
  );
  // body.append("custom_domain", "project-t");
  body.append('location', 'los_angeles');
  // body.append("csgosettings.enable_gotv", "true");
  body.append('csgosettings.mapgroup_start_map', map);

  let makeServer = await fetch('https://dathost.net/api/0.1/game-servers', {
    method: 'POST',
    // @ts-ignore
    body,
    headers,
  });

  let server = await makeServer.json();

  await fetch(`https://dathost.net/api/0.1/game-servers/${server.id}/start`, {
    method: 'POST',
    headers,
  });

  makeServer = await fetch(
    `https://dathost.net/api/0.1/game-servers/${server.id}`,
    {
      headers,
    },
  );

  server = await makeServer.json();

  const matchBody = new FormData();
  matchBody.append('game_server_id', server.id);
  matchBody.append('map', map);
  matchBody.append(
    'webhook_authorization_header',
    process.env.WEBHOOK_AUTHORIZATION,
  );
  if (team1Players) {
    matchBody.append('team1_steam_ids', team1Players && team1Players.join(','));
  }

  if (team2Players) {
    matchBody.append('team2_steam_ids', team2Players.join(','));
  }

  matchBody.append('message_prefix', 'tournaments.wtf');
  matchBody.append(
    'round_end_webhook_url',
    'https://csgo.tournaments.wtf/api/csgo/match/webhooks/round-end',
  );
  matchBody.append(
    'match_end_webhook_url',
    'https://csgo.tournaments.wtf/api/csgo/match/webhooks/match-end',
  );

  const createMatch = await fetch('https://dathost.net/api/0.1/matches', {
    method: 'POST',
    // @ts-ignore
    body: matchBody,
    headers,
  });

  await createMatch.json();

  await prisma.cSGOMatch.update({
    where: { id: matchId },
    data: {
      ip: `${server.raw_ip}:${server.ports.game}`,
      serverMatchId: server.id,
    },
  });

  res.status(200).json({ message: 'Server created' });
};

export default createServer;

import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { numberOfTeams, tournamentId } = body;

  if (!numberOfTeams || !tournamentId) {
    return res.status(400);
  }

  const teams = await prisma.team.findMany({ include: { players: true } });

  const fakeRegistrations = teams.slice(0, numberOfTeams).map((team: any) => {
    const playerIds = team.players.map((player: any) => player.id);
    return {
      tournamentId,
      teamId: team.id,
      players: playerIds,
      userId: team.ownerUserId,
    };
  });

  const registered = await prisma.registrant.createMany({
    data: fakeRegistrations,
  });

  return res.status(200).json({ registered });
};

import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'You must be logged in to register' });
  }
  const { user } = session;
  const { body } = req;
  const { teamId, players }: { teamId: string; players: string[] } =
    JSON.parse(body);
  // This is ID for this route to make registration easier
  const tournamentId = req.query.slug as string;

  // Check if user has ability to register team
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (team?.ownerUserId !== user.id) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to register this team' });
  }

  const register = await prisma.registrant.create({
    data: { userId: user.id, teamId, tournamentId, players },
  });
  return res.status(200).json(register);
};

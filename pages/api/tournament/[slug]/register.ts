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
  try {
    const register = await prisma.registrant.create({
      data: { userId: user.id, teamId, tournamentId, players },
      select: { team: true },
    });
    return res.status(200).json(register);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Team is already registered' });
    }

    return res.status(400).json({ error: 'Something went wrong' });
  }
};

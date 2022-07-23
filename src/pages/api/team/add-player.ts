import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { teamId, playerId, owner } = body;

  const session = await getSession({ req });

  if (session?.user.id !== owner) {
    return res
      .status(401)
      .json({ error: true, message: 'You are not the owner of this team.' });
  }

  const request = await prisma.team.update({
    select: { players: true },
    where: { id: teamId },
    data: { players: { connect: { id: playerId } } },
  });
  return res.status(200).json(request);
};

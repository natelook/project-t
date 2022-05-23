import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { teamId, playerId } = body;
  const request = await prisma.team.update({
    select: { players: true },
    where: { id: teamId },
    data: { players: { connect: { id: playerId } } },
  });
  return res.status(200).json(request);
};

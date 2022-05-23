import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const team = await prisma.team.findUnique({
    where: { id: id as string },
    select: { players: true },
  });
  res.status(200).json(team);
};

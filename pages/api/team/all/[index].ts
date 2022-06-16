import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const teams = await prisma.team.findMany({
    take: 20,
    // skip: 20 * parseInt(index as string, 10),
    include: { _count: true, players: true },
  });
  return res.status(200).json(teams);
};

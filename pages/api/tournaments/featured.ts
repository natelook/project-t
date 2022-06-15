import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tournaments = await prisma.tournament.findMany({
    take: 4,
    include: {
      registrants: true,
    },
  });
  return res.status(200).json(tournaments);
};

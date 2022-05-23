import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tournaments = await prisma.tournament.findMany();
  return res.status(200).json(tournaments);
};

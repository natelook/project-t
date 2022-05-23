import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const teams = await prisma.team.findMany();
  return res.status(200).json(teams);
};

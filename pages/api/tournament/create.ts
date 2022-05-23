import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { name, format, startDate, createdBy, slug } = body;
  console.log(slug);

  const tournament = await prisma.tournament.create({
    data: { name, format, startDate, createdBy, slug },
    // select: { startDate: true, slug: true },
  });
  return res.status(200).json(tournament);
};
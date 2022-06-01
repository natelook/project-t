import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const {
    name,
    format,
    startDate,
    createdBy,
    slug,
    game,
    maxRegistrants,
    mainStream,
  } = body;

  const tournament = await prisma.tournament.create({
    data: {
      name,
      format,
      startDate,
      createdBy,
      slug,
      game,
      maxRegistrants,
      mainStream,
    },
  });

  return res.status(200).json(tournament);
};

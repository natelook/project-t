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
    stream,
  } = body;

  console.log(maxRegistrants);

  const tournament = await prisma.tournament.create({
    data: {
      name,
      format,
      startDate,
      createdBy,
      slug,
      game,
      maxRegistrants,
      stream,
    },
  });

  return res.status(200).json(tournament);
};

import prisma from '@lib/prisma';
import { Tournament } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  const {
    name,
    format,
    startDate,
    createdBy,
    slug: url,
    game,
    maxRegistrants,
    mainStream,
    roundWinConditions,
    description,
    // bannerFileType,
  } = JSON.parse(req.body);

  const updateData: Partial<Tournament> = {
    name,
    format,
    startDate,
    createdBy,
    slug: url,
    game,
    maxRegistrants,
    mainStream,
    roundWinConditions,
    description,
  };

  const update = await prisma.tournament.update({
    where: { slug: slug as string },
    data: updateData,
  });

  return res.status(200).json({ tournament: update });
};

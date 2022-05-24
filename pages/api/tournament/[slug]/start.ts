import prisma from '@lib/prisma';
import { Match } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }
  const id = req.query.slug;

  if (!id) {
    return res.status(403);
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: id as string },
    include: { registrants: true },
  });

  if (!tournament) {
    return res.status(404);
  }

  if (tournament.createdBy !== session.user.id) {
    return res.status(401);
  }

  // const totalRegistrants = tournament.registrants.length;
  const totalRegistrants = 8;

  const createMatches = new Array(totalRegistrants).map((i: number) => {
    console.log(i);
  });

  return res.status(200).json({ message: 'Tournament Started' });
};

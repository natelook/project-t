import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, matchId } = req.query;
  const match = await prisma.tournament.findUnique({
    where: { slug: slug as string },
    select: {
      matches: {
        where: { matchId: parseInt(matchId as string, 10) },
        select: {
          teamOne: {
            select: {
              players: true,
              name: true,
              id: true,
            },
          },
          teamTwo: {
            select: {
              players: true,
              name: true,
              id: true,
            },
          },
          nextMatch: true,
          round: true,
          tournament: true,
          matchId: true,
        },
      },
    },
  });

  return res.status(200).json(match?.matches[0]);
};

import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  if (!slug) {
    return res.status(400).json({ error: true, message: 'No slug' });
  }

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      registrants: {
        orderBy: { registeredAt: 'desc' },
        include: {
          team: {
            include: {
              players: true,
            },
          },
        },
      },
      matches: {
        include: { teamOne: true, teamTwo: true, tournament: true },
        orderBy: { matchId: 'asc' },
      },
    },
  });

  return res.status(200).json(tournament);
};

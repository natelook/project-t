import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, matchId } = req.query;

  const tournament = await prisma.tournament.findUnique({
    where: { slug: slug as string },
    include: {
      matches: {
        where: { matchId: parseInt(matchId as string, 10) },
        include: {
          teamOne: {
            include: {
              owner: true,
              players: true,
            },
          },
          teamTwo: {
            include: {
              owner: true,
              players: true,
            },
          },
        },
      },
    },
  });

  const match = tournament.matches[0];

  if (!tournament || !match) {
    return res.status(404).json({ error: 'Not Found' });
  }

  return res.status(200).json({ tournament, match });
};

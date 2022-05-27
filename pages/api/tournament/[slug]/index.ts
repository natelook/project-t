import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  if (!slug) {
    return res.status(400).json({ error: true, message: 'No slug' });
  }

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    select: {
      registrants: {
        select: {
          teamId: true,
          team: {
            select: {
              name: true,
            },
          },
        },
      },
      name: true,
      startDate: true,
      createdBy: true,
      id: true,
      slug: true,
      format: true,
      matches: {
        select: {
          id: true,
          round: true,
          matchIdentifier: true,
          teams: true,
          teamOneId: true,
          teamTwoId: true,
        },
      },
    },
  });

  return res.status(200).json(tournament);
};

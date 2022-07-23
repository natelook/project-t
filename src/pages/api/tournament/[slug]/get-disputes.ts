import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // the id is passed instead of slug to make it easier to look up disputes
  const { slug: id } = req.query;

  const disputes = await prisma.dispute.findMany({
    where: {
      tournamentId: id as string,
    },
    include: {
      match: true,
      reporter: true,
      team: true,
    },
  });

  return res.status(200).json(disputes);
};

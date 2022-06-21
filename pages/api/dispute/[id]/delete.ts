import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      error: 'You must be signed in and authorized to delete a dispute',
    });
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: id as string },
    include: { tournament: true },
  });

  if (dispute.tournament.createdBy !== session.user.id) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to delete this dispute' });
  }

  const deleteDispute = await prisma.dispute.delete({
    where: { id: id as string },
  });

  return res.status(200).json(deleteDispute);
};

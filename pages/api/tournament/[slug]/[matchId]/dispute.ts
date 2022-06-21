import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
import { getSession } from 'next-auth/react';
import { Team } from '@prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ error: 'You must be logged in to report a score' });
  }

  const { slug: tournamentId, matchId } = req.query;
  const { message, team }: { message: string; team: Team } = JSON.parse(
    req.body,
  );

  if (!team) {
    return res.status(400).json({ error: 'You must submit a team' });
  }

  if (!message) {
    return res.status(400).json({ error: 'You must send a message' });
  }

  if (
    session.user.id !== team.ownerUserId ||
    session.user.id !== process.env.SUPERADMIN
  ) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to file a dispute.' });
  }

  const createDispute = await prisma.dispute.create({
    data: {
      matchId: parseFloat(matchId as string),
      message,
      reporterId: session.user.id,
      tournamentId: tournamentId as string,
      teamId: team.id,
    },
    include: {
      tournament: true,
    },
  });

  await prisma.notification.create({
    data: {
      message: `A new dispute has been filed for ${createDispute.tournament.name}`,
      link: `/${createDispute.tournament.slug}/disputes`,
      userId: createDispute.tournament.createdBy,
    },
  });

  return res.status(200).json(createDispute);
};

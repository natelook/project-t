import prisma from '@lib/prisma';
import validateTeamOwner from '@lib/validateUser';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { teamId, teamName, playerId } = body;

  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ error: true, message: 'You are not signed in.' });
  }

  const isOwner = await validateTeamOwner(teamId, session.user.id);

  if (!isOwner) {
    return res
      .status(401)
      .json({ error: true, message: 'You are not the owner of this team.' });
  }

  const request = await prisma.teamInvitation.create({
    data: { teamId, invitedPlayerId: playerId },
    select: { invitedPlayer: true },
  });

  await prisma.notification.create({
    data: {
      message: `You have been invited to join ${teamName}. Click to resond.`,
      link: '/profile',
      userId: playerId,
    },
  });
  return res.status(200).json(request);
};

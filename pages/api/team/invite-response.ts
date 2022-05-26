import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'You must sign in' });
  }

  const body = JSON.parse(req.body);
  const { answer, inviteId } = body;

  if (!answer || !inviteId) {
    return res.status(403).json({ error: 'Something went wrong' });
  }
  console.log(answer, inviteId);
  // const invite = await prisma.teamInvitation.findUnique({
  //   where: { id: inviteId },
  // });

  // if (session.user.name !== invite?.invitedPlayerId) {
  //   return res.status(401);
  // }

  if (answer === 'decline') {
    console.log('declined');
    await prisma.teamInvitation.update({
      where: { id: inviteId },
      data: { status: 'Declined' },
    });
    return res
      .status(200)
      .json({ message: 'Successfully declined invitation' });
  }

  const teamInvite = await prisma.teamInvitation.update({
    where: { id: inviteId },
    data: { status: 'Accepted' },
    select: { id: true, team: true, invitedPlayerId: true },
  });

  await prisma.team.update({
    where: { id: teamInvite.team.id },
    data: { players: { connect: { id: teamInvite.invitedPlayerId } } },
  });

  return res
    .status(200)
    .json({ done: `Accepted invitation and joined ${teamInvite.team.name}` });
};

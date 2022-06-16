import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { notificationId } = body;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      error: true,
      message: 'You must be signed in',
    });
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  if (notification?.userId !== session.user.id) {
    return res.status(401).json({
      error: true,
      message: 'You are not authorized to read this notification',
    });
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  return res.status(200).json({ message: 'Read message' });
};

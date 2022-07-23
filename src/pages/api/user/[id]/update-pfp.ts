import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { pfp } = body;
  const { id: userId } = req.query;

  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ error: 'You must be signed in' });
  }

  if (userId !== session.user.id) {
    return res
      .status(403)
      .json({ error: 'You do not have permission to update this profile.' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'No user id' });
  }

  if (!pfp) {
    return res.status(400).json({ error: 'No data submitted' });
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { pfp },
  });

  return res.status(200).json({ user: updateUser });
};

import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { newUsername } = body;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      error: true,
      message: 'You must be signed in',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return res.status(401).json({
      error: true,
      message: 'You are not authorized to update this username',
    });
  }

  try {
    const updateUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username: newUsername },
    });

    console.log({ updateUser });

    return res.status(200).json({ message: 'Username updated', updateUser });
  } catch (error) {
    return res.status(403).json({ error: 'Username is already taken' });
  }
};

import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { playerName } = body;

  if (!playerName)
    return res
      .status(400)
      .json({ error: true, message: 'Must submit a player name.' });

  const result = await prisma.user.findUnique({
    where: { username: playerName },
  });

  return res.status(200).json(result);
};

import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        username: true,
        teams: {
          select: {
            name: true,
            players: true,
            owner: true,
            id: true,
          },
        },
        ownedTeams: {
          select: {
            name: true,
            id: true,
            players: true,
          },
        },
        tournaments: true,
        teamInvitations: {
          select: {
            id: true,
            team: true,
            status: true,
          },
        },
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: true, message: error });
    }
    return res.status(400).json({ error: true, message: error });
  }
};

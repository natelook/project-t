import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      include: {
        teams: {
          include: {
            players: true,
            owner: true,
          },
        },
        ownedTeams: {
          include: {
            players: true,
          },
        },
        tournaments: true,
        teamInvitations: {
          include: {
            team: {
              include: {
                players: true,
              },
            },
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

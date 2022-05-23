import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

export default async function CreateTeam(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  console.log({ session, req });
  if (!session) {
    console.log('not authed');
    return res.status(401).json({
      error: true,
      message: 'You must be logged in to create a team.',
    });
  }
  const body = JSON.parse(req.body);
  const { teamName } = body;

  if (!teamName) {
    return res
      .status(400)
      .json({ error: true, message: 'Must submit a team name.' });
  }
  console.log(session?.user);

  try {
    const data = await prisma.team.create({
      data: { name: teamName, owner_user_id: '1' },
    });
    return res.status(200).json({ data });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.message);
      return res
        .status(400)
        .json({ error: true, message: error.message, code: error.code });
    }

    return res.status(400).json({ error: true, message: error.toString() });
  }
}

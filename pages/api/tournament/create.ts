import presignImage from '@lib/presignImage';
import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ error: 'You must be signed in to create a tournament.' });
  }

  const {
    name,
    format,
    startDate,
    createdBy,
    slug,
    game,
    maxRegistrants,
    mainStream,
    roundWinConditions,
    bannerFileType,
  } = JSON.parse(req.body);

  let post: any;
  if (bannerFileType) {
    post = presignImage(bannerFileType, 'banner');
  }

  const tournament = await prisma.tournament.create({
    data: {
      name,
      format,
      startDate,
      createdBy,
      slug,
      game,
      maxRegistrants,
      mainStream,
      roundWinConditions,
      banner: post ? `${post.url}/${post.fields.key}` : null,
    },
  });

  return res.status(200).json({ post, tournament });
};

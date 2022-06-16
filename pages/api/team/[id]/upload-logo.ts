import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import s3 from '@lib/s3-bucket';
import prisma from '@lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: teamId } = req.query;
  const { fileType } = JSON.parse(req.body);

  const post = s3.createPresignedPost({
    Bucket: 'project-t.wtf',
    Fields: {
      key: `logos/${uuidv4()}.png`,
      'Content-Type': fileType,
      acl: 'public-read',
    },
    Expires: 60,
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });
  const { url, fields } = post;
  const logoUrl = `${url}/${fields.key}`;
  await prisma.team.update({
    where: { id: teamId as string },
    data: { logo: logoUrl },
  });
  res.status(200).json({ post, imageUrl: logoUrl });
};

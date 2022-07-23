import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
import presignImage from '@lib/presignImage';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: teamId } = req.query;
  const { fileType }: { fileType: string } = JSON.parse(req.body);

  const { url, fields } = presignImage(fileType, 'logos');
  const logoUrl = `${url}/${fields.key}`;
  await prisma.team.update({
    where: { id: teamId as string },
    data: { logo: logoUrl },
  });
  res.status(200).json({ post: { url, fields }, imageUrl: logoUrl });
};

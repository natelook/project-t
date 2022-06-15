import prisma from '@lib/prisma';
import { getSession } from 'next-auth/react';

export default async function GetUserNotifications(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "You must be logged in to see notifications"});
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
  });

  return res.status(200).json(notifications);
}

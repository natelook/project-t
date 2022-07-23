import prisma from './prisma';

export default async function validateTeamOwner(teamId: string, owner: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { ownerUserId: true },
  });
  return team?.ownerUserId === owner;
}

/* eslint-disable */
import randomNoun from '../lib/random-noun';
import prisma from '../lib/prisma';
import seedData from './seed-data.json';

async function main() {
  // Create users
  const fakeUsers = seedData.users.map((user) => ({
    ...user,
    pfp: randomNoun(true),
  }));
  const createdUsers = await prisma.user.createMany({ data: fakeUsers });
  const users = await prisma.user.findMany({ take: 1000, skip: 1000 });
  const fakeTournaments = seedData.tournaments.map((tournament, i: number) => {
    return {
      ...tournament,
      createdBy: users[i].id,
    };
  });
  const createdTournaments = await prisma.tournament.createMany({
    data: fakeTournaments,
  });
  const tournaments = await prisma.tournament.findMany();

  const fakeTeamPlayers: { id: string }[][] = [];

  const fakeTeams = seedData.teams.map((team, i) => {
    const index = (i + 1) * 5;
    const fiveUsers = users.slice(index, index + 5);
    const userIds = fiveUsers.map((user: any) => ({ id: user.id }));
    fakeTeamPlayers.push(userIds);
    return {
      ...team,
      ownerUserId: users[index].id,
    };
  });

  const createdTeams = await prisma.team.createMany({ data: fakeTeams });
  const teamsWithIdsAndPlayers = await prisma.team.findMany({
    select: { id: true, players: true },
  });

  let i = 0;
  // Assign players to teams
  for (const players of fakeTeamPlayers) {
    for (const player of players) {
      const addedPlayer = await prisma.team.update({
        select: { players: true },
        where: { id: teamsWithIdsAndPlayers[i].id },
        data: { players: { connect: player } },
      });
    }
    i++;
  }

  const teams = await prisma.team.findMany({
    select: { id: true, players: true, ownerUserId: true },
  });

  const thirtyTwoTeams = teams.slice(0, 32);
  const fakeRegistrations = thirtyTwoTeams.map((team: any) => {
    const playerIds = team.players.map((player: any) => player.id);
    return {
      tournamentId: tournaments[0].id,
      teamId: team.id,
      players: playerIds,
      userId: team.ownerUserId,
    };
  });

  const createdRegistraions = await prisma.registrant.createMany({
    data: fakeRegistrations,
  });

  console.log({
    createdTournaments,
    createdUsers,
    createdTeams,
    createdRegistraions,
  });
}

main()
  .catch((e: any) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });

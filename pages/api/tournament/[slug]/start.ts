import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }
  const id = req.query.slug;

  if (!id) {
    return res.status(403);
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: id as string },
    include: { registrants: true },
  });

  if (!tournament || !tournament?.id) {
    return res.status(404);
  }

  if (tournament.createdBy !== session.user.id) {
    return res.status(401);
  }

  let matchedTeams: string[] | null;
  const matches: any[] = [];
  const totalRegistrants = tournament.registrants.length;
  let match = 1;
  tournament.registrants.forEach((registrant) => {
    if (!matchedTeams) {
      matchedTeams = [registrant.teamId];
      return;
    }
    if (matchedTeams.length === 1) {
      matchedTeams.push(registrant.teamId);
    }
    if (matchedTeams.length === 2) {
      const matchObject = {
        matchIdentifier: match,
        nextMatch: 1,
        teamOneId: matchedTeams[0],
        teamTwoId: matchedTeams[1],
        round: 1,
        tournamentId: tournament.id,
      };
      match += 1;
      matches.push(matchObject);
      matchedTeams = null;
    }
  });

  function createEmptyMatches(totalTeams: number) {
    const remainingMatches = totalTeams / 2 - 1; // 15
    const previousRoundTotalMatches = totalTeams / 2; // 16
    let roundSize = previousRoundTotalMatches / 2; // 8
    let totalMatches = previousRoundTotalMatches;
    let round = 2;

    const emptyMatches: {
      matchIdentifier: number;
      round: number;
      tournamentId: string;
    }[] = [];

    function createEmptyMatch(matchId: number) {
      if (tournament) {
        if (Array.isArray(emptyMatches)) {
          emptyMatches.push({
            matchIdentifier: matchId,
            round,
            tournamentId: tournament.id,
          });
        }
      } else {
        // console.log('no tournament');
      }
    }
    let teamsAddedCurrentRound = 1;
    for (let i = 1; i < remainingMatches; i += 1) {
      const newMatch = totalMatches + 1;
      if (teamsAddedCurrentRound === roundSize) {
        round += 1;
        roundSize /= 2;
        teamsAddedCurrentRound = 0;
      }

      createEmptyMatch(newMatch);
      totalMatches += 1;
      teamsAddedCurrentRound += 1;
    }
    return emptyMatches;
  }
  const emptyMatches = createEmptyMatches(totalRegistrants);
  const allMatches = matches.concat(emptyMatches);

  const addMatches = await prisma.match.createMany({ data: allMatches });

  return res.status(200).json({ message: 'Tournament Started', addMatches });
};

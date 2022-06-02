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
    include: {
      registrants: {
        select: { teamId: true },
      },
    },
  });

  if (!tournament || !tournament?.id) {
    return res.status(404);
  }

  if (tournament.createdBy !== session.user.id) {
    return res.status(401);
  }

  let matchedTeams: string[] = [];
  const matches: any[] = [];
  const totalRegistrants = tournament.registrants.length;
  let matchId = 1; // matchIdentifier
  let nextMatch = totalRegistrants / 2 + 1; // Starting next match
  let matchCreated = 0; // Keeps track of how many matches were created, once there is two this resets to 0
  tournament.registrants.forEach((registrant) => {
    matchedTeams.push(registrant.teamId);

    if (matchedTeams?.length === 2) {
      const matchObject = {
        matchId,
        nextMatch,
        teamOneId: matchedTeams[0],
        teamTwoId: matchedTeams[1],
        round: 1,
        tournamentId: tournament?.id,
      };

      matchId += 1;
      matchCreated += 1;

      if (matchCreated === 2) {
        nextMatch += 1;
        matchCreated = 0;
      }
      matches.push(matchObject);
      matchedTeams = [];
    }
  });

  function createEmptyMatches(totalTeams: number) {
    const remainingMatches = totalTeams / 2 - 1;
    const previousRoundTotalMatches = totalTeams / 2;
    let roundSize = previousRoundTotalMatches / 2;
    let totalMatches = previousRoundTotalMatches;
    let round = 2;

    const emptyMatches: {
      matchId: number;
      round: number;
      tournamentId: string;
      nextMatch: number;
    }[] = [];

    function createEmptyMatch(mID: number) {
      if (tournament) {
        if (Array.isArray(emptyMatches)) {
          emptyMatches.push({
            matchId: mID,
            round,
            tournamentId: tournament.id,
            nextMatch,
          });
        }
      } else {
        // console.log('no tournament');
      }
    }

    let teamsAddedCurrentRound = 1;
    for (let i = 1; i <= remainingMatches; i += 1) {
      const newMatch = totalMatches + 1;
      if (i === remainingMatches) {
        nextMatch = 0;
      }
      createEmptyMatch(newMatch);

      if (teamsAddedCurrentRound === roundSize) {
        round += 1;
        roundSize /= 2;
        teamsAddedCurrentRound = 0;
      }

      matchCreated += 1;
      if (matchCreated === 2) {
        nextMatch += 1;
        matchCreated = 0;
      }

      totalMatches += 1;
      teamsAddedCurrentRound += 1;
    }
    return emptyMatches;
  }
  const emptyMatches = createEmptyMatches(totalRegistrants);
  const allMatches = matches.concat(emptyMatches);

  try {
    const add = await prisma.match.createMany({
      data: allMatches,
    });
    return res.status(200).json({ message: 'Tournament Started', add });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Something went wrong', errorMessage: error });
  }
};

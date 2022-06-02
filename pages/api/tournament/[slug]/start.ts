import prisma from '@lib/prisma';
import { Match } from '@prisma/client';
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

  let { registrants } = tournament;
  let bracketSize = tournament.maxRegistrants;

  const totalRegistrants = tournament.registrants.length;
  const validTournamentSizes = [4, 8, 16, 32, 64, 128, 256];

  if (totalRegistrants > tournament.maxRegistrants) {
    // remove players
    registrants = registrants.slice(0, tournament.maxRegistrants);
  } else {
    bracketSize =
      validTournamentSizes.find((d) => d >= registrants.length) ||
      validTournamentSizes[validTournamentSizes.length - 1];
  }

  let matchId = 1; // matchIdentifier
  let nextMatch = bracketSize / 2 + 1; // Starting next match
  let matchCreated = 0; // Keeps track of how many matches were created, once there is two this resets to 0
  // let firstRoundBye: { matchId: number; teamOneId: string } | null;
  const firstRoundMatches = bracketSize / 2;

  const firstRound: Match[] = [];

  registrants.forEach((registrant, i) => {
    matchCreated += 1;
    const match: Match = {
      matchId,
      nextMatch,
      round: 1,
      tournamentId: tournament.id,
      teamOneId: null,
      teamOneScore: 0,
      teamTwoScore: 0,
      teamTwoId: null,
      winningScore: 1,
      winner: null,
    };

    let matchInfo = match;

    if (i < firstRoundMatches) {
      matchInfo = { ...matchInfo, teamOneId: registrant.teamId };
      firstRound.push(matchInfo);

      if (matchCreated === 2) {
        nextMatch += 1;
        matchCreated = 0;
      }
      matchId += 1;
    } else {
      if (i === firstRoundMatches) matchId = 1;
      firstRound[matchId - 1].teamTwoId = registrant.teamId;
      matchId += 1;
    }
  });

  const firstRoundByes: { matchId: number; teamId: string }[] = [];

  const firstRoundWithByes = firstRound.map((match) => {
    if (!match.teamTwoId && match.teamOneId) {
      firstRoundByes.push({
        matchId: match.nextMatch,
        teamId: match.teamOneId,
      });
      return { ...match, winner: match.teamOneId };
    }

    return match;
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
      teamOneId?: string | null;
      teamTwoId?: string | null;
    }[] = [];

    function createEmptyMatch(mID: number) {
      if (!tournament) return;

      if (Array.isArray(emptyMatches)) {
        const emptyMatch = {
          matchId: mID,
          round,
          tournamentId: tournament.id,
          nextMatch,
        };

        if (firstRoundByes.length !== 0) {
          const advancedTeam: { teamId: string }[] = firstRoundByes.filter(
            ({ matchId: byeMatchId }) => byeMatchId === mID,
          );

          if (advancedTeam.length === 2) {
            emptyMatches.push({
              ...emptyMatch,
              teamOneId: advancedTeam[0].teamId,
              teamTwoId: advancedTeam[1].teamId,
            });
            return;
          }

          if (advancedTeam.length >= 1) {
            emptyMatches.push({
              ...emptyMatch,
              teamOneId: advancedTeam[0].teamId,
            });
            return;
          }
        }

        emptyMatches.push(emptyMatch);
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

  const emptyMatches = createEmptyMatches(bracketSize);
  // @ts-ignore
  const allMatches = firstRoundWithByes.concat(emptyMatches);

  await prisma.tournament.update({
    where: { id: tournament.id },
    data: { maxRegistrants: bracketSize },
  });

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

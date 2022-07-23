import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ error: 'You must be signed in to report the score.' });
  }

  const body = JSON.parse(req.body);
  const { matchId } = req.query;
  const id = parseInt(matchId as string, 10);

  const { tournamentId, teamOneScore, teamTwoScore } = body;

  const match = await prisma.match.findUnique({
    where: {
      tournamentId_matchId: {
        tournamentId,
        matchId: id,
      },
    },
    select: {
      teamOne: {
        select: {
          id: true,
          owner: true,
          players: true,
        },
      },
      teamTwo: {
        select: {
          id: true,
          owner: true,
          players: true,
        },
      },
      winningScore: true,
      nextMatch: true,
    },
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  if (!match.teamOne && !match.teamTwo) {
    return res.status(400).json({
      error: 'There are not enough teams to report the outcome of this match.',
    });
  }

  if (match.teamOne?.players === null && match.teamTwo?.players === null) {
    return res.status(400).json({
      error: 'There are no players',
    });
  }

  const teams = match.teamOne?.players.concat(
    match.teamTwo?.players ? match.teamTwo.players : [],
  );

  const isAuthed = teams?.find((player) => player.id === session?.user.id);

  if (session.user.id !== process.env.SUPERADMIN) {
    if (!isAuthed) {
      return res
        .status(401)
        .json({ error: 'You are not authroized to report this score' });
    }
  }
  let winner: string | null = null;
  if (teamOneScore === match.winningScore && match?.teamOne?.id) {
    winner = match.teamOne.id;
  }

  if (teamTwoScore === match.winningScore && match?.teamTwo?.id) {
    winner = match.teamTwo.id;
  }

  const reportedMatchData = {
    teamOneScore,
    teamTwoScore,
    winner,
  };

  const reportMatch = await prisma.match.update({
    where: {
      tournamentId_matchId: {
        tournamentId,
        matchId: id,
      },
    },
    data: reportedMatchData,
  });

  if (matchId === '0' && winner) {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { winner },
    });
    return res.status(200).json({ reportMatch, winner });
  }

  if (winner) {
    const nextMatchArgs = {
      tournamentId_matchId: {
        tournamentId,
        matchId: match.nextMatch,
      },
    };

    const nextMatch = await prisma.match.findUnique({ where: nextMatchArgs });
    let winnerData = {};
    if (!nextMatch?.teamOneId) {
      winnerData = { teamOneId: winner };
    } else {
      winnerData = { teamTwoId: winner };
    }

    await prisma.match.update({
      // nextMatchArgs,
      where: nextMatchArgs,
      data: winnerData,
    });
  }

  return res.status(200).json({ reportMatch });
};

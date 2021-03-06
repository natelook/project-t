import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const teamRequest = await prisma.team.findUnique({
    where: { id: id as string },
    include: {
      players: true,
      owner: true,
      tournaments: {
        include: {
          tournament: true,
        },
      },
      teamOneMatches: {
        include: {
          teamOne: true,
          teamTwo: true,
          tournament: true,
        },
      },
      teamTwoMatches: {
        include: {
          teamOne: true,
          teamTwo: true,
          tournament: true,
        },
      },
    },
  });

  const teamOneMatches = teamRequest?.teamOneMatches.map((match) => ({
    ...match,
    teamScore: match.teamOneScore,
    oppenentScore: match.teamTwoScore,
    opponent: match.teamTwo,
  }));

  const teamTwoMatches = teamRequest?.teamTwoMatches.map((match) => ({
    ...match,
    teamScore: match.teamTwoScore,
    oppenentScore: match.teamOneScore,
    opponent: match.teamOne,
  }));

  const matches = teamOneMatches?.concat(teamTwoMatches || []);
  const team = {
    ...teamRequest,
    teamOneMatches: null,
    teamTwoMatches: null,
    matches,
  };

  res.status(200).json(team);
};

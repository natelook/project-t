import { Match } from '@prisma/client';

const getTotalRounds = (matches: Match[]) =>
  matches
    .map((item) => item.round)
    .filter((value, index, self) => self.indexOf(value) === index);

export default getTotalRounds;

const countTotalRounds = (totalPlayers: string) => {
  const players = parseInt(totalPlayers, 10);
  let roundMatches = players / 2;
  let totalRounds = 1;
  const addRound = () => {
    if (roundMatches % 2 === 0) {
      roundMatches /= 2;
      totalRounds += 1;
      addRound();
    }
  };
  addRound();

  return totalRounds;
};

export default countTotalRounds;

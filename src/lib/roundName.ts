const roundName = (roundNumber: number, roundArray: number[]) => {
  if (roundArray.length === roundNumber) {
    return 'Final Match';
  }

  if (roundArray.length - 1 === roundNumber) {
    return 'Semi-Finals';
  }

  if (roundArray.length - 2 === roundNumber) {
    return 'Quarter-Finals';
  }

  return `Round ${roundNumber}`;
};

export default roundName;

const readInput = require('./utils/readInput');

readInput(5, data => {
  const boardingPasses = data
    .trim()
    .split('\n');

  const PLANE_ROWS = 127;
  const PLANE_SEATS = 7;
  const MULTIPLIER = 8;
  const STEPS = {
    'B': 'B',
    'F': 'F',
    'L': 'L',
    'R': 'R'
  };
  const TAKE_MAX_OR_MIN = {
    'B': 'max',
    'F': 'min',
    'L': 'min',
    'R': 'max'
  };

  const navigatePlane = (steps, length) => {
    const locator = {min: 0, max: length};

    steps.forEach((step) => {
      const locatorSplit = Math.ceil((locator.max - locator.min) / 2);
      switch (step) {
        case STEPS.B:
        case STEPS.R:
          locator.min = locator.min + locatorSplit;
          break;
        case STEPS.F:
        case STEPS.L:
          locator.max = locator.max - locatorSplit;
          break;
        default:
          break;
      }
    });

    return locator;
  }

  const getSeatId = boardingPass => {
      const rowSteps = boardingPass.slice(0, -3).split('');
      const seatSteps = boardingPass.slice(-3).split('');

      const rowLocator = navigatePlane(rowSteps, PLANE_ROWS);
      const seatLocator = navigatePlane(seatSteps, PLANE_SEATS);

      const row = rowLocator[TAKE_MAX_OR_MIN[rowSteps.slice(-1)]];
      const col = seatLocator[TAKE_MAX_OR_MIN[seatSteps.slice(-1)]];
      
      return (row * MULTIPLIER) + col;
  };

  const getHighestSeatId = passes => passes.map(getSeatId).sort().pop();

  const getMySeat = passes => {
    const seats = passes.map(getSeatId).sort();
    const [min,max] = [Math.min(...seats), Math.max(...seats)];

    return Array.from(Array(max-min), (v, i) => i + min).filter(i => !seats.includes(i)).pop();
  };

  // PART 1 Solution
  console.log(getHighestSeatId(boardingPasses));

  // PART 2 Solution
  console.log(getMySeat(boardingPasses));
});

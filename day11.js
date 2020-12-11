const readInput = require('./utils/readInput');

readInput(11, input => {
  const floor = input.trim().split('\n');

  // directions names for adjacent seat locations
  const DIRECTIONS = {
    'n': 'n',
    'ne': 'ne',
    'e': 'e',
    'se': 'se',
    's': 's',
    'sw': 'sw',
    'w': 'w',
    'nw': 'nw',
  };

  const FLOOR_CHARS = {
    'empty': 'L',
    'floor': '.',
    'occupied': '#'
  };

  // builds an object that represents each square via an 'x, y' prop in waitingArea
  const buildWaitingArea = area => {
    const waitingArea = {};

    for (let y = 0; y < area.length; y++) {
      const row = area[y]
      for (let x = 0; x < row.length; x++) {
        waitingArea[`${x}, ${y}`] = row[x];
      }
    }

    return waitingArea;
  }

  const isOccupied = floorSquare => floorSquare === FLOOR_CHARS.occupied;
  
  // takes and object and checks each prop to see if the value is an occupied seat
  const countOccupiedSeats = seats => Object.keys(seats).reduce((occupiedTotal, seat) =>
      isOccupied(seats[seat]) ? occupiedTotal + 1 : occupiedTotal, 0);

  const getAdjacentSquares = (area, x, y, z = 1) => ({
    [DIRECTIONS.n]: area[`${x}, ${y+z}`],
    [DIRECTIONS.ne]: area[`${x+z}, ${y+z}`],
    [DIRECTIONS.e]: area[`${x+z}, ${y}`],
    [DIRECTIONS.se]: area[`${x+z}, ${y-z}`],
    [DIRECTIONS.s]: area[`${x}, ${y-z}`],
    [DIRECTIONS.sw]: area[`${x-z}, ${y-z}`],
    [DIRECTIONS.w]: area[`${x-z}, ${y}`],
    [DIRECTIONS.nw]: area[`${x-z}, ${y+z}`]
  });

  // counts first visible seat in all directions, if occupied +1 to count, else no seat seen or first seat seen was empty
  const firstVisibleSeatOccupiedCount = (waitingArea, location) => {
    let [x, y] = location.split(', ');
    x = Number(x);
    y = Number(y);

    // empty map of directions for tracking whats been seen
    const seenAdjacentSeats = getAdjacentSquares({});

    let distance = 1;
    let adjacentSquares = getAdjacentSquares(waitingArea, x, y, distance);
    const directions = Object.keys(adjacentSquares);

    while(directions.filter(direction => adjacentSquares[direction]).length > 0) {
      for (let index = 0; index < directions.length; index++) {
        const direction = directions[index];
        const adjacentSquare = adjacentSquares[direction];
        const isSeat = adjacentSquare === FLOOR_CHARS.occupied || adjacentSquare === FLOOR_CHARS.empty;
        const seenSeatInDirection = seenAdjacentSeats[direction];

        if (adjacentSquare && isSeat && !seenSeatInDirection) {
          seenAdjacentSeats[direction] = adjacentSquare;
        }
      }
      
      // stop if you've seen a seat in all directions
      if (directions.filter(direction => !seenAdjacentSeats[direction]).length === 0) {
        break;
      }

      distance+=1;
      
      // expand circle around location by one in all directions
      adjacentSquares = getAdjacentSquares(waitingArea, x, y, distance);
    }
  
    return countOccupiedSeats(seenAdjacentSeats);
  };

  // counts first visible seat in all directions, if occupied +1 to count, else no seat seen or first seat seen was empty
  const adjacentOccupiedSeatCount = (waitingArea, location) => {
    let [x, y] = location.split(', ');
    x = Number(x);
    y = Number(y);

    const adjacentSquares = getAdjacentSquares(waitingArea, x, y);

    return countOccupiedSeats(adjacentSquares);
  };

  const runWaitingAreaSimulation = (waitingArea, occupiedAdjacentSeatCounter, occupiedCountRequiredToEmpty) => {
    let currentWaitingArea = Object.assign({}, waitingArea);

    // while there are changes run the simulation rules on the waiting area
    do {
      const newWaitingArea = Object.assign({}, currentWaitingArea);
      changes = 0;

      for(const square in currentWaitingArea) {
        switch (currentWaitingArea[square]) {
          // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
          case FLOOR_CHARS.occupied:
            if (occupiedAdjacentSeatCounter(currentWaitingArea, square) >= occupiedCountRequiredToEmpty) {
              newWaitingArea[square] = FLOOR_CHARS.empty;
              changes += 1;
            }
            break;
          // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
          case FLOOR_CHARS.empty:
            if (!occupiedAdjacentSeatCounter(currentWaitingArea, square)) {
              newWaitingArea[square] = FLOOR_CHARS.occupied;
              changes += 1;
            }
            break;
          // Floor (.) never changes; seats don't move, and nobody sits on the floor.
          case FLOOR_CHARS.floor:
          default:
            break;
        }
      }

      currentWaitingArea = Object.assign({}, newWaitingArea);
    } while (changes > 0);

    return currentWaitingArea;
  };

  // PART 1 Solution
  console.log(countOccupiedSeats(runWaitingAreaSimulation(buildWaitingArea(floor), adjacentOccupiedSeatCount, 4)));
  
  // PART 2 Solution
  console.log(countOccupiedSeats(runWaitingAreaSimulation(buildWaitingArea(floor), firstVisibleSeatOccupiedCount, 5)));
});

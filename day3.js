const readInput = require('./utils/readInput');

readInput(3, data => {
  const map = data
    .trim();
  
  const TREE = '#';
  const SLOPES = [
    {x: 1, y: 1},
    {x: 1, y: 3},
    {x: 1, y: 5},
    {x: 1, y: 7},
    {x: 2, y: 1}
  ];

  const countTreesInPath = (slope, map) => {
    const mapRows = map.split('\n');
    const mapWidth = mapRows[0].length;
    const currentPosition = {x: 0, y: 0};
    const {x: slopeX, y: slopeY} = slope;
    let spot, treeCount = 0;

    while(mapRows[currentPosition.x + slopeX]) {
      currentPosition.x += slopeX;
      currentPosition.y += slopeY;
      spot = mapRows[currentPosition.x][currentPosition.y % mapWidth];
      if (spot === TREE) {
        treeCount++;
      }
    }

    return treeCount;
  };

  // PART 1 Solution
  console.log(countTreesInPath(SLOPES[1], map));

  // PART 2 Solution
  console.log(SLOPES.reduce((treeCount, slope) => countTreesInPath(slope, map) * treeCount, 1));
});

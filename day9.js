const readInput = require('./utils/readInput');

readInput(9, input => {
  const data = input.trim().split('\n').map(Number);

  const findXMASWeakness = (dataLines, preambleLength) => {
    let preambleLocation = 0;
    let weakness;

    // starting at the next index after the preamble, look for the weakness
    for (let index = preambleLength; index < dataLines.length; index++) {
      const value = dataLines[index];
      const preamble = [...dataLines.slice(preambleLocation, preambleLocation + preambleLength)];
      let sumExistsInPreamble = false;

      // check each preamble value to see if the sum of value exists
      for (let preambleIndex = 0; preambleIndex < preamble.length; preambleIndex++) {
        const x = preamble[preambleIndex];
  
        // sum exists if x + y = value and they arent the same number. x and y are values in the preamble
        if (preamble.find(y => value - x === y && x !== y)) {
          sumExistsInPreamble = true;
          // only need to verify sum exists once and move on
          break;
        }
      }

      // weakness identified
      if (!sumExistsInPreamble) {
        weakness = value;
        break;
      }

      // preamble moves with index
      preambleLocation++;
    }

    return weakness;
  };

  const findContiguousSet = (dataLines, weakness) => {
    let contiguousSetBounds;
  
    for (let index = 0; index < dataLines.length; index++) {
      let total = dataLines[index];
      let nextIndex = index + 1;

      // keep adding the next numbers until pass or equal weakness
      while (total <= weakness) {
        total += dataLines[nextIndex];

        // set found, return indexes of the set
        if (total === weakness) {
          contiguousSetBounds = [index, nextIndex];
          break;
        }

        nextIndex++;
      }

      if (contiguousSetBounds) {
        break;
      }
    }

    const [min, max] = contiguousSetBounds;
    const sortedContiguousSet = dataLines.slice(min, max + 1).sort();

    // return sum of highest and lowest value
    return sortedContiguousSet.shift() + sortedContiguousSet.pop();
  };

  // PART 1 Solution
  const xmasWeakness = findXMASWeakness(data, 25);
  console.log(xmasWeakness);
  
  // PART 2 Solution
  console.log(findContiguousSet(data, xmasWeakness));
});

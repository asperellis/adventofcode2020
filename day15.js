const readInput = require('./utils/readInput');

readInput(15, data => {
  const numbers = data.trim().split(',').map(Number);

  const playGame = (numbers, duration) => {
    let numberCount = 0;
    let lastNumberSpoken = 0;
    const spoken = {};

    while (numberCount < duration) {
      // read initial numbers
      if (numberCount < numbers.length) {
        lastNumberSpoken = numbers[numberCount];
      // after reading initial numbers
      } else {
        if (!spoken[lastNumberSpoken] || spoken[lastNumberSpoken].length === 1) {
          lastNumberSpoken = 0;
        } else {
          lastNumberSpoken = spoken[lastNumberSpoken][1] - spoken[lastNumberSpoken][0];
        }
      }

      // speak
      if (spoken[lastNumberSpoken]) {
        if (spoken[lastNumberSpoken].length >= 2) {
          spoken[lastNumberSpoken] = [spoken[lastNumberSpoken].pop(), numberCount];
        } else {
          spoken[lastNumberSpoken].push(numberCount);
        }
      } else {
        spoken[lastNumberSpoken] = [numberCount];
      }
      
      numberCount++;
    }

    return lastNumberSpoken;
  };

  // PART 1 Solution
  console.log(playGame(numbers, 2020));

  // PART 2 Solution - not the fastest but it works
  console.log(playGame(numbers, 30000000));
});

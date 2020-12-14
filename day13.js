const readInput = require('./utils/readInput');

readInput(13, data => {
  let [earliestDepartureTime, busses] = data
    .trim()
    .split('\n');
    earliestDepartureTime = Number(earliestDepartureTime);
  busses = busses.split(',');

  const getEarliestDepartureTime = (expectedTime, schedule) => {
    let time = expectedTime;
    let bus;

    do {
      bus = schedule.find(busId => busId !== 'x' && time % Number(busId) === 0);
      time += 1;
    } while (!bus);

    return {
      bus: Number(bus),
      depart: time - 1
    }
  };

   /*
        ** Example:
        **
        ** Previous bus is 7, this bus is 13, with delay +1.
        ** A time T is needed such that:
        **      7x == T
        **     13y == (T + 1)
        **
        ** Performing an iterative search for T on multiples of 7 and checking (T + 1)
        ** eventually reveals that:
        **   (7 * 11) == 77
        **   (13 * 6) == 78
        **
        ** To find further times that match this condition, imagine some value W added to T.
        **    7j == T + W
        **   13k == (T + 1) + W
        ** Substituting:
        **    7j == 7x + W,  and j == x + (W / 7)
        **   13k == 13y + W, and k == y + (W / 13)
        ** For j and k to be integers, since x and y are integers, W must be a multiple of both 7 and 13.
        ** Since all input numbers are conveniently prime, the smallest multiple of both 7 and 13 is (7 * 13).
        ** Thus, W == (7 * 13) == 91.
        **
        **
        ** Next, a time T is needed such that:
        **      7x == T
        **     13y == (T + 1)
        **     59z == (T + 4)
        **
        ** Performing an iterative search from 77, adding multiples of 91, eventually reveals that:
        **    (7 * 50) == 350
        **   (13 * 27) == 351
        **    (59 * 6) == 354
        **
        ** As above, the next T that matches this condition would be 350 + (7 * 13 * 59) == 350 + (5369) == 5719.

        return pos;
        for offset, time in buses[1:]:
            while (pos + offset) % time != 0:
                pos += increment

            

        return pos
        */

  const getEarliestOffsetTimestamp = schedule => {
    /* BRUTE FORCE SOLUTION - BY ME - passed all tests
    let time = schedule[0] + 1;
    let run = 1;
    let offsetTimestamp;

    while (!offsetTimestamp) {
      let isOffset = true;

      for (let index = 1; index < schedule.length; index++) {
        const bus = schedule[index];

        if (bus === 'x' || time % Number(bus) === 0) {
          time++;
          continue;
        }

        isOffset = false;
        break;
      }

      if (isOffset) {
        offsetTimestamp = schedule[0] * run;
      } else {
        run++;
        time = schedule[0] * run + 1;
      }
    }

    return offsetTimestamp;
    */

    const modInverse = (a, m) => {
      let g = gcd(a, m);

      if (g != 1n) {
          console.log("No Inverse");
      } else {
          return power(a, m - 2n, m);
      }
    }
    
    const power = (x, y, m) => {
        if (y === 0n) {
          return 1n;
        }
    
        let p = power(x, y / 2n, m) % m;
        p = (p * p) % m;
    
        if (y % 2n === 0n) {
          return p;
        }
        
        return (x * p) % m;
    }
    
    const gcd = (a, b) => {
        if (a === 0n) {
          return b;
        }

        return gcd(b % a, a);
    }

    // TODO: understand CRT (Chinese Remainer Theorem)
    let N = 1n;
    const buses = schedule
      .map(val => Number(val) ? BigInt(val): 'x')
      .map((elm, i) => typeof(elm) === 'bigint' && [elm, BigInt(i)])
      .filter(elm => elm);
    
    buses.forEach(pair => N = N * pair[0]);

    let Ni = buses.map(pair => N / pair[0]);
    let b = buses.map((pair, i) => i === 0 ? 0n : pair[0] - pair[1]);
    let x = buses.map((item,i) => modInverse(Ni[i], item[0]));
    let bnx = Ni.map((item, i) => item * b[i] * x[i]);
    let sum = bnx.reduce((acc, cur) => acc + cur);

    return sum - (sum / N) * N;
  };

  // PART 1 Solution
  const ticket = getEarliestDepartureTime(earliestDepartureTime, busses);
  console.log((ticket.depart - earliestDepartureTime) * ticket.bus);

  // PART 2 Solution
  console.log(getEarliestOffsetTimestamp(busses));
});

const readInput = require('./utils/readInput');

readInput(10, input => {
  const adapters = input.trim().split('\n').map(Number).sort((a,b) => a-b);
  // built in adapter
  adapters.push(adapters[adapters.length-1] + 3);

  const findAdapterChain = adapters => {
    let outletJolts = 0;

    const differences = {
      '1': 0,
      '2': 0,
      '3': 0
    };

    for (let index = 0; index < adapters.length; index++) {
      const adapter = adapters[index];
      const diff = adapter - outletJolts;
      if (diff <= 3) {
        outletJolts = adapter;
        differences[diff] += 1;
      }
    }

    return differences['1'] * differences['3'];
  };

  const findAdapterPossibilities = adapters => {
    const paths = {
      '0': 1
    };

    // all path nodes start with 0
    adapters.forEach(a => paths[a.toString()] = 0);

    // start at 0
    [0, ...adapters].forEach(a => {
      const availablePaths = adapters.filter(adpt => adpt - a > 0 && adpt - a <= 3 );
      availablePaths.forEach(adpt => paths[adpt.toString()] += paths[a.toString()]);
    })

    // get the last adapter value from path counter which gives all combos
    return paths[adapters[adapters.length - 1]];
  };


  // PART 1 Solution
  console.log(findAdapterChain(adapters));
  
  // PART 2 Solution
  console.log(findAdapterPossibilities(adapters));
});

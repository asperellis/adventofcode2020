const readInput = require('./utils/readInput');

readInput(7, data => {
  const makeBag = (color, contains) => {
    return {color, contains};
  }

  const REGULATIONS = data.trim().split('\n').reduce((arr, regulation) => {
    const [color, canContain] = regulation.split(' bags contain ');
    const contents = canContain.trim().slice(0, -1).replace(/ bags?/g,'').split(', ');
    const contains = contents.reduce((map, content) => {
      let [number, ...color] = content.split(' ');
      color = color.join(' ');
      map[color] = number;

      return map;
    }, {});

    return [...arr, makeBag(color, contains)];
  }, []);

  const howManyBagsCanHold = (bagColor) => {
    let bagsThatCanHoldBagColor = 0;
    const stack = [bagColor];
    const seen = {};

    while (stack.length > 0) {
      // take a color from the stack
      const colorInStack = stack.shift();
      // get how many bags can hold that color
      const containsColorInStack = REGULATIONS.filter(regulation => regulation.contains[colorInStack] > 0);
      // for each one add that bag color to the stack unless already counted
      containsColorInStack.forEach(bag => {
        if (seen[bag.color]) {
          return;
        }

        stack.push(bag.color);
        bagsThatCanHoldBagColor++;
        seen[bag.color] = true;
      });
    }

    return bagsThatCanHoldBagColor;
  };

  const howManyMustBagHold = (bagColor, multiplier = 1) => {
    let bagCount = 0;

    const bag = REGULATIONS.find(regulation => regulation.color === bagColor);

    // for all bags inside this bag
    for (const color in bag.contains) {
      // ignore no other
      if (color !== 'other') {
        const count = bag.contains[color];
        // add count of bags inside this bag and how many it must hold using count as a multiplier
        bagCount += Number(bag.contains[color]) + howManyMustBagHold(color, count);
      }
    }

    return bagCount * multiplier;
  };

  // PART 1 Solution
  console.log(howManyBagsCanHold('shiny gold'));
  
  // PART 2 Solution
  console.log(howManyMustBagHold('shiny gold'));
});

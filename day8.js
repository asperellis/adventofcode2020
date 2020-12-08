const readInput = require('./utils/readInput');

readInput(8, data => {
  const CODE = data.trim().split('\n').map(line => {
    let [step, value] = line.split(' ');
    const operator = value.slice(0,1);
    value = (operator === '-' ? -1 : 1) * Number(value.slice(1));

    return {step, value};
  });

  const CODE_STEPS = {
    'acc': 'acc',
    'jmp': 'jmp',
    'nop': 'nop'
  };

  const debugCode = codeLines => {
    let accumulator = 0, location = 0;
    const seen = {};

    // run code, stop if at step already seen
    while (location >= 0 && location < codeLines.length && !seen[location]) {
      const line = codeLines[location];
      let {step, value} = line;
      seen[location] = true;

      switch (step) {
        case CODE_STEPS.acc:
          accumulator += value;
          location += 1;
          break;
        case CODE_STEPS.jmp:
          location += value;
          break;
        case CODE_STEPS.nop:
          location += 1;
        default:
          break;
      }
    }

    return {
      accumulator,
      hasLoop: seen[location] === true,
      location
    };
  };

  const fixCode = codeLines => {
    let accumulator, badLine;

    for (const [location, line] of codeLines.entries()) {
      // ignore acc lines
      if (line.step === CODE_STEPS.acc) {
        continue;
      }

      // fix line of code by switching
      const fixedCode = [
        ...codeLines.slice(0, location),
        {
          step: line.step === CODE_STEPS.jmp ? CODE_STEPS.nop : CODE_STEPS.jmp,
          value: line.value
        },
        ...codeLines.slice(location + 1)
      ];

      // test new code
      const codeExe = debugCode(fixedCode);

      // stop if we've found the fix
      if (!codeExe.hasLoop) {
        accumulator = codeExe.accumulator;
        badLine = location;
        break;
      }
    }

    return {accumulator, badLine} || 'code cannot be fixed';
  };

  
  // PART 1 Solution
  console.log(debugCode(CODE));
  
  // PART 2 Solution
  console.log(fixCode(CODE));
});

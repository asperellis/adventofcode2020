const readInput = require('./utils/readInput');

readInput(14, data => {
  const program = data
    .trim().split('\n').map(line => {
      const [type, value] = line.split(' = ');
      
      if (type === 'mask') {
        return {type, value};
      }

      return {
        type: 'mem',
        location: Number(type.slice(4).slice(0,-1)),
        value: Number(value)
      }
    });
  
  // int to binary
  const toBinary = n => (n >>> 0).toString(2);
  
  // get the sum of a memory objects property values
  const getMemorySum = memory => Object.keys(memory).reduce((sum, key) => sum + memory[key], 0);

  // replaces a single char in a string
  const replaceChar = (str, location, char) => {
    if (location === str.length - 1) {
      return str.substring(0, location) + char;
    } else if (location === 0) {
      return char + str.substring(1);
    }

    return str.substring(0, location) + char + str.substring(location + 1);
  }

  // v1
  const runProgram = input => {
    const memory = {};
    let mask;

    // run the program lines
    input.forEach(({type, value, location}) => {
      // set a new mask
      if (type === 'mask') {
        mask = value;
        return;
      }

      // else store value in mem after applying mask
      const binaryValue = toBinary(value).toString();
      let result = String(mask); // copy

      for (
        let maskIndex = result.length - 1, binaryValueIndex = binaryValue.length - 1;
        maskIndex >= 0;
        maskIndex--, binaryValueIndex--
      ) {
        if (result[maskIndex] === 'X') {
          // use binary value at char index else 0
          const charToReplace = binaryValueIndex >= 0 ? binaryValue[binaryValueIndex] : '0';
          result = replaceChar(result, maskIndex, charToReplace)
        }
      }

      memory[location] = parseInt(result, 2);
    });

    return getMemorySum(memory);
  }

  // v2
  const runProgramV2 = input => {
    const memory = {};
    let mask;

    input.forEach(({type, value, location}) => {
      // set a new mask
      if (type === 'mask') {
        mask = value;
        return;
      }

      // else store value in mem after applying mask
      const binaryValue = toBinary(location).toString();
      let result = String(mask);

      for (
        let maskIndex = result.length - 1, binaryValueIndex = binaryValue.length - 1;
        maskIndex >= 0;
        maskIndex--, binaryValueIndex--
      ) {
        // If the bitmask bit is 0, the corresponding memory address bit is unchanged.
        // so apply memory address bit to final result instead of 0
        if (result[maskIndex] === '0' && binaryValueIndex >= 0) {
          result = replaceChar(result, maskIndex, binaryValue[binaryValueIndex]);
        }
        // If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
        // If the bitmask bit is X, the corresponding memory address bit is floating.
        // Both cases do nothing to result
      }

      // storing value in various memory addresses based on number of floating bits (X) in result string
      const stack = [];
      let memLinesWritten = 1;
      const seen = {};

      // cheap way I came up with to get all the various combinations of the floating bits
      // for each X in the result string push two string copies only changing that one X to a 1 and 0
      // then track in seen map to prevent doubles, which I was seeing. Again, cheap ways.
      for (let resultIndex = 0; resultIndex < result.length; resultIndex++) {
        const one = replaceChar(result, resultIndex, '1');
        const zero = replaceChar(result, resultIndex, '0');
        if (result[resultIndex] === 'X') {
          stack.push(one, zero);
          seen[one] = true;
          seen[zero] = true;
        }
      }

      while (stack.length > 0) {
        const resultItem = stack.pop();

        // if no X, use as memory location and store value
        if (!resultItem.includes('X')) {
          seen[resultItem] = true;
          memory[parseInt(resultItem, 2)] = value;
          memLinesWritten++;
          continue;
        }

        // else repeat the X replacement strat with this string and push to stack if not seen
        for (let i = 0; i < resultItem.length; i++) {
          if (resultItem[i] === 'X') {
            const one = replaceChar(resultItem, i, '1');
            const zero = replaceChar(resultItem, i, '0');
            if (!seen[one]) {
              stack.push(one);
              seen[one] = true;
            }
            if (!seen[zero]) {
              stack.push(zero);
              seen[zero] = true; 
            }
          }
        }
      }
    });

    return getMemorySum(memory);
  }

  // PART 1 Solution
  console.log(runProgram(program));

  // PART 2 Solution
  console.log(runProgramV2(program));
});

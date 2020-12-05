const readInput = require('./utils/readInput');

readInput(2, data => {
  const passwords = data
    .trim()
    .split('\n');
    

  const findValidPasswords = (passwords, check) => passwords.filter(check);

  const parsePassword = password => {
    const [limit, char, passwordStr] = password.split(' ');
    const [min, max] = limit.split('-');

    return {char: char.replace(':', ''), max, min, passwordStr};
  };

  const doesPasswordMeetCharacterCount = password => {
    const {char, min, max, passwordStr} = parsePassword(password);

    const numberOfCharInPassword = passwordStr.split(char).length - 1;
  
    return numberOfCharInPassword >= min && numberOfCharInPassword <= max;
  }

  const doesPassworHaveOnlyOneCharacter = password => {
    const {char, min, max, passwordStr} = parsePassword(password);
  
    const charAtMin = passwordStr[min-1];
    const charAtMax = passwordStr[max-1];
    const bothContainChar = charAtMin === char && charAtMax === char;
    const neitherContainChar = charAtMin !== char && charAtMax !== char;
  
    return bothContainChar || neitherContainChar ? false : true;
  }

  // PART 1 Solution
  console.log(findValidPasswords(passwords, doesPasswordMeetCharacterCount).length);

  // PART 2 Solution
  console.log(findValidPasswords(passwords, doesPassworHaveOnlyOneCharacter).length);
});

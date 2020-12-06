const readInput = require('./utils/readInput');

readInput(6, data => {
  const groups = data.trim().split('\n\n');

  const countGroupAnswers = groupAnswers => {
    const answers = {};
    const individuals = groupAnswers.split('\n');
    const groupSize = individuals.length;

    individuals.forEach(individualAnswers => {
      individualAnswers.split('').forEach(answer =>
        answers[answer] ? answers[answer] += 1 : answers[answer] = 1);
    });

    return {answers, groupSize};
  };

  const countYes = (total, {answers}) => total += Object.keys(answers).length;

  const countAllYes = (total, {answers, groupSize}) => {
    let allYes = 0;
    for (const answer in answers) {
      if (answers[answer] === groupSize) {
        allYes++;
      }
    }
    return total += allYes;
  };

  // PART 1 Solution
  console.log(groups.map(countGroupAnswers).reduce(countYes, 0));

  // PART 2 Solution
  console.log(groups.map(countGroupAnswers).reduce(countAllYes, 0));
});

const readInput = require('./utils/readInput');

readInput(1, data => {
  const expenseReports = data
    .trim()
    .split('\n')
    .map(Number);

  
  const multiplyExpenses = (expenses) => (expenses).reduce((total, expense) => expense * total, 1);

  const findTwoExpensesSum = (sum, report) => {
    for (const expense of report) {
      const diff = expenseReports.find(secondExpense => expense === sum - secondExpense);

      if (diff) {
        return [expense, diff];
      }
    }

    return [];
  };

  const findThreeExpenseSum = (sum, report) => {
    for (const expense of report) {
      const twoOtherTotallingSum = findTwoExpensesSum(sum - expense, report.filter(e => e !== expense));

      if (twoOtherTotallingSum.length > 0) {
        return [expense, ...twoOtherTotallingSum];
      }
    }

    return [];
  };

  // PART 1 Solution
  console.log(multiplyExpenses(findTwoExpensesSum(2020, expenseReports)));

  // PART 2 Solution
  console.log(multiplyExpenses(findThreeExpenseSum(2020, expenseReports)));
});

const readInput = require('./utils/readInput');

readInput(16, data => {
  // data prep
  let [rules, myTicket, nearbyTickets] = data.trim().split('\n\n');
  
  // tickets
  myTicket = myTicket.split('\n')[1].split(',').map(Number);
  nearbyTickets = nearbyTickets.split('\n').slice(1).map(ticket => ticket.split(',').map(Number));
  
  // rules 
  rules = rules.split('\n').map(rule => {
    const [name, values] = rule.split(': ');
    const critera = values.trim().split(' or ').map(value => {
      const [min, max] = value.split('-');
      return {min: Number(min), max: Number(max)};
    });

    return {name, critera};
  });

  // all the rules criteras in an array
  const allRulesCriteria = rules.reduce((ruleChecks, rule) => [...ruleChecks, ...rule.critera], []);

  // helpers
  const isValid = (rule, value) => value >= rule.min && value <= rule.max;
  const meetsRuleCriteria = (rule, value) => rule && rule.critera.some(r => isValid(r, value));
  const sumOfInvalidTicketValues = (invalidTicketValues, value) =>
    invalidTicketValues + (allRulesCriteria.find(criteria => isValid(criteria, value)) ? 0 : value);
  
  // valid tickets
  const validTickets = nearbyTickets.filter(ticket => ticket.reduce(sumOfInvalidTicketValues, 0) === 0);

  // group ticket values by index
  const ticketValuesByIndex = [myTicket, ...validTickets].reduce((arr, ticket) => {
    ticket.forEach((value, index) => {
      if(!arr[index]) {
        arr[index] = [value];
      } else {
        arr[index].push(value);
      }
    });
    return arr;
  }, []);

  // map of rules to their index location in a ticket - start at null
  const ruleNameToValueIndexMap = rules.reduce((map, rule) => ({...map, [`${rule.name}`]: null}), {});

  // all the possible matches for each index as an obj
  const matchesByType = ticketValuesByIndex.map((ticket, index) => {
    const matches = [];
    for (let i = 0; i < rules.length; i++) {
      const match = ticket.every(t => meetsRuleCriteria(rules[i], t));
      if (match) {
        matches.push(rules[i].name);
      }
    }
    return {index, matches};
  });

  // sort the matches for each index by length and start with the one that has a single match
  // set ruleNameToValueIndexMap values by only possible rule the index could match
  matchesByType.sort((a, b) => a.matches.length - b.matches.length).forEach(({index, matches}) => {
    const ruleName = matches.filter(ruleName => ruleNameToValueIndexMap[ruleName] === null).pop();
    ruleNameToValueIndexMap[ruleName] = index;
  });

  // PART 1 Solution
  const invalidValueSum = nearbyTickets.reduce((invalidValueSum, ticket) => invalidValueSum + ticket.reduce(sumOfInvalidTicketValues, 0), 0);
  console.log(invalidValueSum);

  // PART 2 Solution - could be shorter but works
  const productOfAllMyTicketDepartureValues = Object.keys(ruleNameToValueIndexMap)
    .filter(ruleName => ruleName.includes('departure'))
    .map(key => ruleNameToValueIndexMap[key])
    .map(index => myTicket[index])
    .reduce((total, tval) => total * tval, 1);
  console.log(productOfAllMyTicketDepartureValues);
});

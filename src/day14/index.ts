import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const polymerTemplate = input[0];
  const rules = {};
  input.slice(2).forEach((rule) => {
    const parts = rule.split(" -> ");
    rules[parts[0]] = parts[1];
  });

  // get pairs
  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    const pair = polymerTemplate.slice(i, i + 1);
    console.log(pair);
  }

  return;
};

export default dayFunction;

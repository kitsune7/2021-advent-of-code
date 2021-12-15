import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const startingPolymerTemplate = input[0];

  const rules = {};
  input.slice(2).forEach((rule) => {
    const parts = rule.split(" -> ");
    rules[parts[0]] = [parts[0][0] + parts[1], parts[1] + parts[0][1]];
  });

  let pairs = {};
  const letterCounts: Record<string, number> = {};
  for (let i = 0; i < startingPolymerTemplate.length - 1; i++) {
    incrementOrInstantiate(pairs, startingPolymerTemplate.slice(i, i + 2));
  }
  for (let i = 0; i < startingPolymerTemplate.length; i++) {
    incrementOrInstantiate(letterCounts, startingPolymerTemplate[i]);
  }

  const getNextStep = () => {
    const nextPairCounts = Object.assign({}, pairs);
    Object.keys(pairs).forEach((pair) => {
      rules[pair].forEach((rulePair) => {
        incrementOrInstantiate(nextPairCounts, rulePair, pairs[pair]);
      });
      nextPairCounts[pair] -= pairs[pair];

      incrementOrInstantiate(
        letterCounts,
        rules[pair][0].slice(1),
        pairs[pair]
      );
    });
    pairs = nextPairCounts;
  };

  for (let i = 0; i < 40; i++) {
    getNextStep();
  }

  const highestCount = Math.max(...Object.values(letterCounts));
  const lowestCount = Math.min(...Object.values(letterCounts));

  return highestCount - lowestCount;
};

const incrementOrInstantiate = (
  obj: Record<string, number>,
  property,
  incrementAmount = 1
) => {
  if (typeof obj?.[property] === "undefined") {
    obj[property] = incrementAmount;
  } else {
    obj[property] += incrementAmount;
  }
};

export default dayFunction;

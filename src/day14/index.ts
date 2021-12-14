import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  let startingPolymerTemplate = input[0];

  const rules = {};
  input.slice(2).forEach((rule) => {
    const parts = rule.split(" -> ");
    rules[parts[0]] = parts[1];
  });

  const getNextStep = (polymerTemplate) => {
    let newPolymerTemplate = polymerTemplate[0];

    for (let i = 0; i < polymerTemplate.length - 1; i++) {
      const pair = polymerTemplate.slice(i, i + 2);
      newPolymerTemplate += `${rules[pair]}${pair[1]}`;
    }

    return newPolymerTemplate;
  };

  for (let i = 0; i < 10; i++) {
    startingPolymerTemplate = getNextStep(startingPolymerTemplate);
  }

  const frequency = getFrequencyMap(startingPolymerTemplate);
  const highestCount = Math.max(...Object.values(frequency));
  const lowestCount = Math.min(...Object.values(frequency));

  return highestCount - lowestCount;
};

const getFrequencyMap = (letters: string): Record<string, number> => {
  const frequency: Record<string, number> = {};
  Array.from(letters).forEach((letter) => {
    if (!frequency?.[letter]) {
      frequency[letter] = 1;
    } else frequency[letter] += 1;
  });
  return frequency;
};

export default dayFunction;

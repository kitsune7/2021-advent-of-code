import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const corruptedPoints = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  const chunkMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
  };

  const totalPoints = input.reduce((total, line) => {
    let stack = [];
    for (let i = 0; i < line.length; i++) {
      const character = line[i];

      if (Object.keys(chunkMap).includes(character)) {
        stack.push(character);
      } else if (chunkMap[stack.pop()] !== character) {
        return total + corruptedPoints[character];
      }
    }
    return total;
  }, 0);

  console.log(totalPoints);
  return totalPoints;
};

export default dayFunction;

import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const autocompletePoints = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };
  const chunkMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
  };

  const incompleteLines = input.filter((line) => {
    let stack = [];
    for (let i = 0; i < line.length; i++) {
      const character = line[i];

      if (Object.keys(chunkMap).includes(character)) {
        stack.push(character);
      } else if (chunkMap[stack.pop()] !== character) {
        return false;
      }
    }
    return true;
  });

  const pointsPerLine = incompleteLines.map((line) => {
    let stack = [];
    for (let i = 0; i < line.length; i++) {
      stack.push(line[i]);
    }

    let autocompleteString = "";
    let closingStack = [];
    while (stack.length) {
      const character = stack.pop();
      if (Object.values(chunkMap).includes(character)) {
        closingStack.push(character);
      }
      if (Object.keys(chunkMap).includes(character)) {
        if (closingStack.length) {
          closingStack.pop();
        } else {
          autocompleteString += chunkMap[character];
        }
      }
    }

    return Array.from(autocompleteString).reduce((total, character) => {
      return total * 5 + autocompletePoints[character];
    }, 0);
  });
  const middleIndex = Math.floor(pointsPerLine.length / 2);
  pointsPerLine.sort((a, b) => (a < b ? -1 : 1));

  console.log(pointsPerLine[middleIndex]);
  return pointsPerLine[middleIndex];
};

export default dayFunction;

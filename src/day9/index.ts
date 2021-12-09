import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const lowPoints = [];

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const number = Number(input[row][col]);
      const lessThanTop = row === 0 || number < Number(input[row - 1][col]);
      const lessThanBottom =
        row === input.length - 1 || number < Number(input[row + 1][col]);
      const lessThanLeft = col === 0 || number < Number(input[row][col - 1]);
      const lessThanRight =
        col === input[row].length - 1 || number < Number(input[row][col + 1]);

      if (lessThanTop && lessThanBottom && lessThanLeft && lessThanRight) {
        lowPoints.push(number);
      }
    }
  }

  const result = lowPoints.reduce((total, lowPoint) => {
    return total + lowPoint + 1;
  }, 0);
  console.log(result);
  return result;
};

export default dayFunction;

import { DayFunction } from "../utilities";

type Direction = "top" | "left" | "right" | "bottom";
type Row = number;
type Col = number;
type Point = `${Row},${Col}`;

const dayFunction: DayFunction = (input: string[]) => {
  const basinSizes: number[] = [];
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
        lowPoints.push(`${row},${col}`);
      }
    }
  }

  const getBasinSize = (currentPoint: Point, tracked: Point[]): number => {
    const [row, col] = currentPoint.split(",").map(Number);
    const value = Number(input[row][col]);

    if (
      row !== 0 &&
      !tracked.includes(`${row - 1},${col}`) &&
      input[row - 1][col] !== "9" &&
      value < Number(input[row - 1][col])
    ) {
      const point: Point = `${row - 1},${col}`;
      tracked.push(point);
      getBasinSize(point, tracked);
    }
    if (
      row !== input.length - 1 &&
      !tracked.includes(`${row + 1},${col}`) &&
      input[row + 1][col] !== "9" &&
      value < Number(input[row + 1][col])
    ) {
      const point: Point = `${row + 1},${col}`;
      tracked.push(point);
      getBasinSize(point, tracked);
    }
    if (
      col !== 0 &&
      !tracked.includes(`${row},${col - 1}`) &&
      input[row][col - 1] !== "9" &&
      value < Number(input[row][col - 1])
    ) {
      const point: Point = `${row},${col - 1}`;
      tracked.push(point);
      getBasinSize(point, tracked);
    }
    if (
      col !== input[row].length - 1 &&
      !tracked.includes(`${row},${col + 1}`) &&
      input[row][col + 1] !== "9" &&
      value < Number(input[row][col + 1])
    ) {
      const point: Point = `${row},${col + 1}`;
      tracked.push(point);
      getBasinSize(point, tracked);
    }

    return tracked.length;
  };

  for (let i = 0; i < lowPoints.length; i++) {
    basinSizes.push(getBasinSize(lowPoints[i], [lowPoints[i]]));
  }

  basinSizes.sort((a, b) => (a < b ? -1 : 1));
  const result = basinSizes.pop() * basinSizes.pop() * basinSizes.pop();
  console.log(result);
  return result;
};

export default dayFunction;

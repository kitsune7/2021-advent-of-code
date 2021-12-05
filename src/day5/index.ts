import { DayFunction } from "../utilities";

type CoordinateCount = number;
type LineCoords = Record<`${number},${number}`, CoordinateCount>;

const dayFunction: DayFunction = (input: string[]) => {
  const lines = input.map((line) => {
    const points = line.split(" -> ");
    return points.map((point) =>
      point.split(",").map((coordinate) => Number(coordinate))
    );
  });

  const lineCoords: LineCoords = {};

  function addLineCoord(coordinate: string) {
    if (lineCoords?.[coordinate]) {
      lineCoords[coordinate]++;
    } else {
      lineCoords[coordinate] = 1;
    }
  }

  lines.forEach((line) => {
    const x1 = line[0][0];
    const x2 = line[1][0];
    const y1 = line[0][1];
    const y2 = line[1][1];

    const xIsSame = x1 === x2;
    const yIsSame = y1 === y2;
    const differentDirections = (x1 < x2 && y1 > y2) || (x1 > x2 && y1 < y2);

    const lowestX = Math.min(x1, x2);
    const highestX = Math.max(x1, x2);
    const lowestY = Math.min(y1, y2);
    const highestY = Math.max(y1, y2);

    if (yIsSame) {
      for (let i = lowestX; i <= highestX; i++) {
        addLineCoord(`${i},${y1}`);
      }
    } else if (xIsSame) {
      for (let i = lowestY; i <= highestY; i++) {
        addLineCoord(`${x1},${i}`);
      }
    } else if (differentDirections) {
      const typeA = x1 < x2 && y1 > y2;
      const typeB = x1 > x2 && y1 < y2;
      if (typeA) {
        for (let x = x1, i = 0; x <= x2; x++, i++) {
          addLineCoord(`${x},${y1 - i}`);
        }
      } else {
        for (let x = x2, i = 0; x <= x1; x++, i++) {
          addLineCoord(`${x},${y2 - i}`);
        }
      }
    } else {
      for (let x = lowestX, i = 0; x <= highestX; x++, i++) {
        addLineCoord(`${x},${lowestY + i}`);
      }
    }
  });

  let total = 0;
  Object.values(lineCoords).forEach((count) => {
    if (count > 1) {
      total++;
    }
  });

  console.log(total);
  return total;
};

export default dayFunction;

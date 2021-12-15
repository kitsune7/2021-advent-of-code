import { DayFunction } from "../utilities";
import { printMatrix, zeros } from "../utilities/general";

type Point = number[];

const dayFunction: DayFunction = (input: string[]) => {
  const valueMatrix: number[][] = input.map((line) =>
    line.split("").map(Number)
  );
  const endCoordinate = [valueMatrix.length - 1, valueMatrix[0].length - 1];

  function pointToString(point: Point): string {
    return point[0] + "," + point[1];
  }

  function greedyPath(startingPoint: Point, totalCost = 0) {
    const [row, col] = startingPoint;
    const currentValue = valueMatrix[row][col];
    const downValue = valueMatrix?.[row + 1]?.[col] ?? Number.POSITIVE_INFINITY;
    const rightValue =
      valueMatrix?.[row]?.[col + 1] ?? Number.POSITIVE_INFINITY;

    if (
      downValue === Number.POSITIVE_INFINITY &&
      rightValue === Number.POSITIVE_INFINITY
    ) {
      return totalCost + currentValue;
    }
    if (rightValue < downValue) {
      return greedyPath([row, col + 1], totalCost + currentValue);
    }
    return greedyPath([row + 1, col], totalCost + currentValue);
  }

  const coordinateToShortestPath: Record<string, number> = {};

  function getShortestPath(startingPoint: Point): number | null {
    const [row, col] = startingPoint;
    const coordinate = pointToString(startingPoint);

    if (!valueMatrix?.[row]?.[col]) {
      return null;
    }
    if (coordinateToShortestPath?.[coordinate]) {
      return coordinateToShortestPath[coordinate];
    }

    const currentValue = valueMatrix[row][col];
    if (row === endCoordinate[0] && col === endCoordinate[1]) {
      coordinateToShortestPath[coordinate] = currentValue;
      return currentValue;
    }

    const rightPath = getShortestPath([row, col + 1]);
    const downPath = getShortestPath([row + 1, col]);

    let shortestPath = null;
    if (!downPath) shortestPath = currentValue + rightPath;
    else if (!rightPath) shortestPath = currentValue + downPath;
    else if (downPath < rightPath) shortestPath = currentValue + downPath;
    else shortestPath = currentValue + rightPath;

    coordinateToShortestPath[coordinate] = shortestPath;
    return shortestPath;
  }

  return getShortestPath([0, 0]) - valueMatrix[0][0];
};

export default dayFunction;

import { DayFunction } from "../utilities";

type Point = number[];

const dayFunction: DayFunction = (input: string[]) => {
  const valueMatrix: number[][] = input.map((line) =>
    line.split("").map(Number)
  );
  const endCoordinate = [valueMatrix.length - 1, valueMatrix[0].length - 1];

  function pointToString(point: Point): string {
    return point[0] + "," + point[1];
  }

  const coordinateToShortestPath: Record<string, number> = {};
  const visited = new Set<string>();

  function getShortestPath(startingPoint: Point): number | null {
    const [row, col] = startingPoint;
    const coordinate = pointToString(startingPoint);
    visited.add(coordinate);

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
    else if (rightPath < downPath) shortestPath = currentValue + rightPath;
    else shortestPath = currentValue + downPath;

    coordinateToShortestPath[coordinate] = shortestPath;
    return shortestPath;
  }

  return getShortestPath([0, 0]) - valueMatrix[0][0];
};

export default dayFunction;

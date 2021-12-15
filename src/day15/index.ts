import { DayFunction } from "../utilities";

type Point = number[];

const dayFunction: DayFunction = (input: string[]) => {
  const valueMatrix: number[][] = input.map((line) =>
    line.split("").map(Number)
  );
  const originalDimensions = [valueMatrix.length, valueMatrix[0].length];
  for (let row = 0; row < originalDimensions[0] * 5; row++) {
    if (!valueMatrix?.[row]) valueMatrix.push([]);
    const rowSection = Math.floor(row / originalDimensions[0]);

    for (let col = 0; col < originalDimensions[1] * 5; col++) {
      const colSection = Math.floor(col / originalDimensions[1]);
      if (rowSection + colSection > 0) {
        valueMatrix[row][col] = getCellValue(rowSection, colSection, row, col);
      }
    }
  }
  const endCoordinate = [valueMatrix.length - 1, valueMatrix[0].length - 1];

  function getCellValue(rowSection, colSection, row, col) {
    const sectionSum = rowSection + colSection;
    const originalValue =
      valueMatrix[row % originalDimensions[0]][col % originalDimensions[1]];
    let value = originalValue + sectionSum;

    return value % 9 === 0 ? 9 : value % 9;
  }

  function pointToString(point: Point): string {
    return point[0] + "," + point[1];
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

import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const [pointLines, instructionLines] = input
    .join("\n")
    .split("\n\n")
    .map((input) => input.split("\n"));

  const points = pointLines.map((line) => line.split(",").map(Number));
  const maxX = Math.max(...points.map((point) => point[0]));
  const maxY = Math.max(...points.map((point) => point[1]));

  let pointMatrix = [];
  for (let i = 0; i <= maxY; i++) {
    pointMatrix.push([]);
    for (let j = 0; j <= maxX; j++) {
      pointMatrix[i].push(0);
    }
  }

  points.forEach((point) => {
    pointMatrix[point[1]][point[0]] = 1;
  });

  const instructions: Array<[string, number]> = instructionLines.map(
    (line) =>
      line.split("=").map((value, i) => {
        if (i === 0) {
          return value;
        }
        return Number(value);
      }) as [string, number]
  );

  function copyMatrixOverRows(
    largeMatrix: number[][],
    smallMatrix: number[][]
  ): number[][] {
    const startingRow = largeMatrix.length - smallMatrix.length;

    for (let i = 0; i < smallMatrix.length; i++) {
      for (let j = 0; j < smallMatrix[i].length; j++) {
        const value = smallMatrix[i][j];
        if (value) {
          largeMatrix[i + startingRow][j] = value;
        }
      }
    }

    return largeMatrix;
  }

  function copyMatrixOverColumns(
    largeMatrix: number[][],
    smallMatrix: number[][]
  ): number[][] {
    const startingColumn = largeMatrix[0].length - smallMatrix[0].length;

    for (let i = 0; i < smallMatrix.length; i++) {
      for (let j = 0; j < smallMatrix[i].length; j++) {
        const value = smallMatrix[i][j];
        if (value) {
          largeMatrix[i][j + startingColumn] = value;
        }
      }
    }

    return largeMatrix;
  }

  // instructions.forEach((instruction) => {
  const [direction, position] = instructions[0];
  if (direction === "fold along y") {
    const lowerMatrix = pointMatrix.slice(0, position);
    const upperMatrix = pointMatrix.slice(position + 1).reverse();

    if (lowerMatrix.length >= upperMatrix.length) {
      pointMatrix = copyMatrixOverRows(lowerMatrix, upperMatrix);
    } else {
      pointMatrix = copyMatrixOverRows(upperMatrix, lowerMatrix);
    }
  } else if (direction === "fold along x") {
    const lowerMatrix = pointMatrix.map((row) => row.slice(0, position));
    const upperMatrix = pointMatrix.map((row) =>
      row.slice(position + 1).reverse()
    );

    if (lowerMatrix[0].length >= upperMatrix[0].length) {
      pointMatrix = copyMatrixOverColumns(lowerMatrix, upperMatrix);
    } else {
      pointMatrix = copyMatrixOverColumns(upperMatrix, lowerMatrix);
    }
  }
  // });

  printMatrix(pointMatrix);

  return countMatrix(pointMatrix);
};

function printMatrix(matrix: number[][]) {
  const matrixLines = matrix.map((row) =>
    row.map(String).join("").replace(/0/g, ".").replace(/1/g, "#")
  );

  console.log();
  matrixLines.forEach((line) => console.log(line));
}

function countMatrix(matrix: number[][]): number {
  return matrix.reduce(
    (total, row) =>
      total +
      row.reduce((rowTotal, cell) => {
        return rowTotal + cell;
      }, 0),
    0
  );
}

export default dayFunction;

// LRGPRECB?

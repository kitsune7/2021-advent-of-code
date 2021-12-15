import chalk from "chalk";

export const incrementOrInstantiate = (
  obj: Record<string, number>,
  property,
  incrementAmount = 1
) => {
  if (typeof obj?.[property] === "undefined") {
    obj[property] = incrementAmount;
  } else {
    obj[property] += incrementAmount;
  }
};

export const logicalSort = (a, b) => (a < b ? -1 : 1);

export type PrintMatrixOptions = {
  mark?: number[][];
  spaced?: boolean;
};
export const printMatrix = (
  matrix: Array<Array<string | number>>,
  options: PrintMatrixOptions = { spaced: false }
) => {
  matrix.forEach((row, rowIndex) => {
    console.log(
      row.reduce((line, item, colIndex) => {
        const output = `${line}${item}${options?.spaced ? " " : ""}`;
        return options?.mark?.includes([rowIndex, colIndex])
          ? chalk.bgWhite(output)
          : output;
      }, "")
    );
  });
};

export const zeros = (rows: number, cols: number): number[][] => {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push([]);
    for (let j = 0; j < cols; j++) {
      matrix[i].push(0);
    }
  }
  return matrix;
};

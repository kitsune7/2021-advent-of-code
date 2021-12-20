import chalk from "chalk";

export type Coordinate = [number, number];
export type Matrix<T = any> = T[][];

export type PrintMatrixOptions = {
  mark?: Coordinate[];
  spaced?: boolean;
};
export const printMatrix = (
  matrix: Matrix,
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

export function countCellsWithValue<T = any>(
  matrix: Matrix<T>,
  value: T
): number {
  return matrix.reduce((total, row) => {
    const rowTotal = row.reduce(
      (rowTotal, cellValue) => rowTotal + (cellValue === value ? 1 : 0),
      0
    );
    return total + rowTotal;
  }, 0);
}

export const getAdjacentCells = (
  matrix: Matrix,
  row,
  col,
  outOfBoundsValue
): Matrix => {
  const get = (row, col) => matrixGet(matrix, row, col, outOfBoundsValue);

  return [
    [get(row - 1, col - 1), get(row - 1, col), get(row - 1, col + 1)],
    [get(row, col - 1), get(row, col), get(row, col + 1)],
    [get(row + 1, col - 1), get(row + 1, col), get(row + 1, col + 1)],
  ];
};

export const identityMatrix = (numberOfDimensions = 2): Matrix<number> => {
  const matrix = [];

  for (let i = 0; i < numberOfDimensions; i++) {
    matrix.push([]);
    for (let j = 0; j < numberOfDimensions; j++) {
      matrix[i].push(j === i ? 1 : 0);
    }
  }

  return matrix;
};

export const matrixMultiply = (
  a: Matrix<number>,
  b: Matrix<number>
): Matrix<number> => {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
    throw new Error("Arguments `a` and `b` should two dimensional arrays");
  }
  if (typeof a?.[0]?.[0] !== "number" || typeof b?.[0]?.[0] !== "number") {
    throw new Error("Arguments `a` and `b` must contain numbers");
  }
  if (a[0].length !== b.length) {
    throw new Error("Matrix dimensions don't match");
  }

  const result = createMatrix<number>(a.length, b[0].length);
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[0].length; j++) {
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] = result[i][j] + a[i][k] * b[k][j];
      }
    }
  }
  return result;
};

export function createMatrix<T = any>(
  rows: number,
  columns: number,
  fill: T | number = 0
): Matrix<T> {
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    matrix.push(Array(columns).fill(fill));
  }

  return matrix;
}

export const Matrix = <T>(matrix: Matrix<T>) => {
  const matrixObject: {
    xDirection: 1 | -1;
    yDirection: 1 | -1;
    get: (row: number, column: number, outOfBoundsValue?: any) => T | null;
  } = {
    xDirection: 1,
    yDirection: 1,
    get: (row: number, column: number, outOfBoundsValue?: any) =>
      matrixGet(matrix, row, column, outOfBoundsValue),
  };

  return new Proxy(matrixObject, {
    get: (target, property) => {
      if (isArrayIndex(property)) {
        const targetValue =
          matrix[getIndex(matrix, Number(property), target.yDirection)];
        return target.xDirection === -1 ? targetValue.reverse() : targetValue;
      }

      return Reflect.get(target, property);
    },
    set: (target, property, value) => {
      if (isArrayIndex(property)) {
        return Reflect.set(
          matrix,
          getIndex(matrix, Number(property), target.yDirection),
          value
        );
      }

      return Reflect.set(target, property, value);
    },
  });
};

function isArrayIndex(property: string | symbol): boolean {
  return Number.isInteger(Number(property));
}

function getIndex(matrix: Matrix, index: number, yDirection: 1 | -1): number {
  if (yDirection === -1) {
    const maxIndex = matrix.length - 1;
    return maxIndex - index;
  }
  return index;
}

function matrixGet<T>(
  matrix: Matrix<T>,
  row: number,
  column: number,
  outOfBoundsValue = null
): T | null {
  return matrix?.[row]?.[column] ?? outOfBoundsValue;
}

export type PlotPointParams = {
  data: string | number;
  matrix: Matrix;
  matrixTransform?: Matrix<number>;
  x: number;
  y: number;
};
export const plotPoint = ({
  data,
  matrix,
  matrixTransform,
  x,
  y,
}: PlotPointParams) => {};

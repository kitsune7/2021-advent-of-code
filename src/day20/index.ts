import {
  countCellsWithValue,
  DayFunction,
  getAdjacentCells,
  printMatrix,
} from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const imageEnhancementAlgorithm = input[0];
  let inputImage = input.slice(2).map((line) => line.split(""));
  let outOfBoundsCharacter = ".";

  function ensureClearBorders() {
    if (bordersAreClear()) return;

    const borderPadding = 3;
    const extraLength = 2 * borderPadding;

    inputImage = [
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
      ...inputImage.map((row) => [
        outOfBoundsCharacter,
        outOfBoundsCharacter,
        outOfBoundsCharacter,
        ...row,
        outOfBoundsCharacter,
        outOfBoundsCharacter,
        outOfBoundsCharacter,
      ]),
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
      Array(inputImage[0].length + extraLength).fill(outOfBoundsCharacter),
    ];
  }

  const bordersAreClear = (): boolean => {
    function everyCellMatches(row) {
      return row.every((cell) => cell === borderCharacter);
    }

    const borderCharacter = inputImage[0][0];
    const topRowsClear = inputImage.slice(0, 3).every(everyCellMatches);
    const bottomRowsClear = inputImage
      .slice(inputImage.length - 3)
      .every(everyCellMatches);
    const edgeColumnsClear = inputImage
      .slice(3, inputImage.length - 3)
      .every((row, rowIndex) =>
        row.every((cell, columnIndex) => {
          if (columnIndex >= 3 && columnIndex < inputImage[rowIndex].length - 3)
            return true;
          return cell === borderCharacter;
        })
      );

    return topRowsClear && bottomRowsClear && edgeColumnsClear;
  };

  const getNewPixelValue = (row, col): string => {
    const adjacent = getAdjacentCells(
      inputImage,
      row,
      col,
      outOfBoundsCharacter
    );
    const position = parseInt(
      adjacent.reduce(
        (binaryNum, row) =>
          binaryNum + row.map((cell) => (cell === "." ? "0" : "1")).join(""),
        ""
      ),
      2
    );

    return imageEnhancementAlgorithm[position];
  };

  function enhanceImage() {
    ensureClearBorders();

    const nextInputImage = [];
    for (let row = 0; row < inputImage.length; row++) {
      nextInputImage.push([...inputImage[row]]);
    }

    for (let row = 0; row < inputImage.length; row++) {
      for (let col = 0; col < inputImage[row].length; col++) {
        nextInputImage[row][col] = getNewPixelValue(row, col);
      }
    }
    inputImage = nextInputImage;

    getNewOutOfBoundsCharacter();
    ensureClearBorders();
  }

  function getNewOutOfBoundsCharacter() {
    const position =
      outOfBoundsCharacter === "." ? 0 : parseInt("1".repeat(9), 2);
    outOfBoundsCharacter = imageEnhancementAlgorithm[position];
  }

  console.log("starting image");
  ensureClearBorders();
  printMatrix(inputImage);

  enhanceImage();
  console.log("after enhancing image once");
  printMatrix(inputImage);

  enhanceImage();
  console.log("after enhancing image twice");
  printMatrix(inputImage);

  // 7070 is too high
  return countCellsWithValue(inputImage, "#");
};

export default dayFunction;

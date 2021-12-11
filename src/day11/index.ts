import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const octomatrix = input.map((line) => line.split("").map(Number));
  let flashCount = 0;
  const flashed = new Set();

  const runStep = () => {
    for (let row = 0; row < octomatrix.length; row++) {
      for (let col = 0; col < octomatrix[row].length; col++) {
        gainEnergy(row, col);
      }
    }
    flashed.clear();
  };

  const gainEnergy = (row: number, col: number) => {
    if (octomatrix[row][col] + 1 > 9) {
      flash(row, col);
    } else if (!flashed.has(`${row},${col}`)) {
      octomatrix[row][col] += 1;
    }
  };

  const absorbEnergy = (row: number, col: number) => {
    const outOfBounds =
      row < 0 ||
      col < 0 ||
      row >= octomatrix.length ||
      col >= octomatrix[row].length;
    if (outOfBounds || flashed.has(`${row},${col}`)) return;
    gainEnergy(row, col);
  };

  const flash = (row: number, col: number) => {
    flashCount++;
    flashed.add(`${row},${col}`);
    octomatrix[row][col] = 0;
    absorbEnergy(row - 1, col - 1);
    absorbEnergy(row - 1, col);
    absorbEnergy(row - 1, col + 1);
    absorbEnergy(row, col - 1);
    absorbEnergy(row, col + 1);
    absorbEnergy(row + 1, col - 1);
    absorbEnergy(row + 1, col);
    absorbEnergy(row + 1, col + 1);
  };

  for (let i = 0; i < 100; i++) {
    runStep();
  }

  console.log(flashCount);
  return flashCount;
};

export default dayFunction;

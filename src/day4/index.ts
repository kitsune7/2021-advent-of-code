import { DayFunction } from "../utilities";

type BingoNumber = {
  marked: boolean;
  value: number;
};
type BingoRow = [
  BingoNumber,
  BingoNumber,
  BingoNumber,
  BingoNumber,
  BingoNumber
];
type Board = [BingoRow, BingoRow, BingoRow, BingoRow, BingoRow];

const dayFunction: DayFunction = (input: string[]) => {
  const bingoNumbers = input[0].split(",").map((num) => Number(num));
  const boards = getBoards(input.slice(2));

  runBingo(boards, bingoNumbers);
};

function getBoards(lines: string[]): Board[] {
  const boards = [];

  let board = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) {
      boards.push([...board]);
      board = [];
    } else {
      board.push(
        line
          .split(/ +/)
          .filter((num) => num !== "")
          .map((value) => ({ marked: false, value: Number(value) }))
      );
    }
  }

  return boards;
}

function runBingo(boards: Board[], bingoNumbers: number[]) {
  for (let i = 0; i < bingoNumbers.length; i++) {
    markBoards(bingoNumbers[i], boards);

    const winningBoardIndex = indexOfWinningBoard(boards);
    if (winningBoardIndex) {
      winGame(boards[winningBoardIndex], winningBoardIndex, bingoNumbers[i]);
      break;
    }
  }
}

function markBoards(selectedNumber: number, boards: Board[]) {
  boards.forEach((board) => {
    board.forEach((row) => {
      row.forEach((bingoNumber) => {
        if (bingoNumber.value === selectedNumber) {
          bingoNumber.marked = true;
        }
      });
    });
  });
}

function indexOfWinningBoard(boards: Board[]): number | null {
  for (let i = 0; i < boards.length; i++) {
    if (isWinningBoard(boards[i])) {
      return i;
    }
  }

  return null;
}

function isWinningBoard(board: Board): boolean {
  return board.some(isWinningRow) || hasWinningColumn(board);
}

function isWinningRow(row: BingoRow): boolean {
  return row.every((bingoNumber) => bingoNumber.marked);
}

function hasWinningColumn(board: Board): boolean {
  for (let i = 0; i < board[0].length; i++) {
    if (isWinningColumn(i, board)) {
      return true;
    }
  }
  return false;
}

function isWinningColumn(columnIndex: number, board: Board): boolean {
  return board.every((row) => row[columnIndex].marked);
}

function winGame(
  winningBoard: Board,
  winningBoardIndex: number,
  winningNumber: number
) {
  console.log(`Winning board: ${winningBoardIndex}`);
  console.log(`Answer: ${winningNumber * sumUnmarked(winningBoard)}`);
  printBoard(winningBoard);
}

function sumUnmarked(board: Board): number {
  return board.reduce(
    (boardTotal, row) =>
      boardTotal +
      row.reduce(
        (rowTotal, bingoNumber) =>
          rowTotal + (bingoNumber.marked ? 0 : bingoNumber.value),
        0
      ),
    0
  );
}

function printBoard(board: Board) {
  board.forEach((row) => {
    console.log(
      row.reduce(
        (rowString, bingoNumber) =>
          `${rowString}${bingoNumber.marked ? "*" : " "} ${
            bingoNumber.value
          }\t`,
        ""
      )
    );
  });
  console.log();
}

export default dayFunction;

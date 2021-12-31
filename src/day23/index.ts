import { DayFunction, Matrix } from '../utilities'

type Position = [number, number]
type Move = {
  cost: number
  end: Position
  start: Position
}
type SolutionTree = {
  board: Board
  complete?: boolean
  move?: Move
  possibleSolutions: Set<SolutionTree>
}
type Node = {
  character: string
  col: number
  row: number
}
type Board = Matrix<string>

const dayFunction: DayFunction = (input: string[]) => {
  // Pad input
  const lineLength = input[0].length
  const initialBoard = input.map((line) =>
    (line.length === lineLength ? line : line + '  ').split('')
  )

  const completeBoardString = `#############
#...........#
###A#B#C#D###
  #A#B#C#D#  
  #########  `
  const validNodes = ['A', 'B', 'C', 'D']
  const nodeToDestinationColumnIndex = {
    A: 3,
    B: 5,
    C: 7,
    D: 9,
  }
  const nodeToMoveCost = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
  }

  function getPossibleSolutions(board: Board): Set<SolutionTree> {
    const possibleSolutions: Set<SolutionTree> = new Set()
    getNodes(board).forEach((node) => {
      const possibleMoves = getPossibleMoves(board, node)
      possibleMoves.forEach((move) => {
        const newBoard = getBoardAfterMove(board, move)
        possibleSolutions.add({
          board: newBoard,
          complete: isCompleteBoard(newBoard),
          move,
          possibleSolutions: new Set(),
        })
      })
    })
    return possibleSolutions
  }

  function isCompleteBoard(board: Board): boolean {
    const boardString = board.map((line) => line.join('')).join('\n')
    return boardString === completeBoardString
  }

  function getBoardAfterMove(board: Board, move: Move): Board {
    return board.map((row, rowIndex) =>
      row.map((col, colIndex) => {
        const positionString = `${rowIndex},${colIndex}`
        if (positionString === move.start.toString()) {
          return '.'
        }
        if (positionString === move.end.toString()) {
          return board[move.start[0]][move.start[1]]
        }
        return col
      })
    )
  }

  function getPossibleMoves(board: Board, node: Node): Move[] {
    const accessibleOpenSpaces = getAccessibleOpenSpaces(board, [node.row, node.col])

    const validSpaces = accessibleOpenSpaces.filter(
      (position) =>
        isNodeFinishedMoving(board, {
          character: node.character,
          col: position[1],
          row: position[0],
        }) ||
        (!isHallway(node.row) && isHallway(position[0]) && !isAboveRoom(board, position))
    )

    // Optimization for when the best move is clearly evident
    const finishPosition = validSpaces.find((position) => !isHallway(position[0]))
    if (finishPosition) {
      return [finishPosition].map((position) => endPositionToMove(position, node))
    }

    return validSpaces.map((position) => endPositionToMove(position, node))
  }

  function getAccessibleOpenSpaces(
    board: Board,
    position: Position,
    usedPositions: Set<string> = new Set()
  ): Position[] {
    const [row, col] = position
    const adjacentPositions = (
      [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
      ] as Position[]
    ).filter(
      (position) =>
        !usedPositions.has(position.toString()) && board[position[0]][position[1]] === '.'
    )

    if (!adjacentPositions.length) {
      return positionSetToPositionArray(usedPositions)
    }

    adjacentPositions.forEach((position) => usedPositions.add(position.toString()))

    const accessibleOpenSpaces = adjacentPositions
      .map((position) => getAccessibleOpenSpaces(board, position, usedPositions))
      .flat()
    return accessibleOpenSpaces.filter(
      (position, i) =>
        !accessibleOpenSpaces
          .slice(0, i)
          .find((otherPosition) => otherPosition.toString() === position.toString())
    )
  }

  function positionSetToPositionArray(positions: Set<string>): Array<Position> {
    return Array.from(positions).map((position) => position.split(',').map(Number) as Position)
  }

  function isNodeFinishedMoving(board: Board, node: Node): boolean {
    if (node.character !== '#' && node.col !== nodeToDestinationColumnIndex[node.character]) {
      return false
    }

    return (
      node.character === '#' ||
      isNodeFinishedMoving(board, {
        col: node.col,
        character: board[node.row + 1][node.col],
        row: node.row + 1,
      })
    )
  }

  function isHallway(row: number) {
    const hallwayRow = 1
    return row === hallwayRow
  }

  function isAboveRoom(board: Board, position: Position): boolean {
    return board[position[0] + 1][position[1]] !== '#'
  }

  function getNodes(board: Board): Node[] {
    const nodes = []

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const character = board[row][col]
        if (validNodes.includes(character)) {
          nodes.push({
            character,
            col,
            row,
          })
        }
      }
    }

    return nodes
  }

  function endPositionToMove(end: Position, node: Node): Move {
    return {
      cost:
        (Math.abs(end[0] - node.row) + Math.abs(end[1] - node.col)) *
        nodeToMoveCost[node.character],
      end,
      start: [node.row, node.col],
    }
  }

  return
}

function printBoard(board: Matrix) {
  board.forEach((line) => console.log(line.join('')))
}

export default dayFunction

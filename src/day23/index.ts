import { DayFunction, Matrix } from '../utilities'

type Position = [number, number]
type Move = {
  cost: number
  end: Position
  start: Position
}
type SolutionTree = {
  board: Board
  dead: boolean
  move?: Move
  parent: SolutionTree | null
  possibleSolutions: Array<SolutionTree> | null
  totalCost: number
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

  const completeBoardString = `#############\n#...........#\n###A#B#C#D###\n  #A#B#C#D#  \n  #########  `
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
  const hallwayRow = 1

  function findLowestCost(): number {
    let lowestCost = Number.POSITIVE_INFINITY
    let currentTree = {
      board: initialBoard,
      dead: false,
      parent: null,
      possibleSolutions: null,
      totalCost: 0,
    }

    while (
      currentTree.possibleSolutions === null ||
      currentTree.parent !== null ||
      currentTree.possibleSolutions.some((solution) => !solution.dead)
    ) {
      // console.log(`Examining tree with total cost of ${currentTree.totalCost}.`)
      // printBoard(currentTree.board)

      if (currentTree.dead) {
        // console.log('Tree is dead. Moving to parent.')
        currentTree = currentTree.parent
      } else if (currentTree.possibleSolutions === null) {
        // console.log(`This tree hasn't been visited yet. Checking possible solutions.`)
        const possibleSolutions = getPossibleSolutions(currentTree).filter(
          (solution) => solution.totalCost < lowestCost
        )
        const completedSolution = possibleSolutions.find(
          (solution) => solution.possibleSolutions !== null
        )

        if (completedSolution) {
          console.log(`Found a path with a new lowest cost of ${completedSolution.totalCost}`)
          printSolution(completedSolution)
          currentTree.possibleSolutions = [completedSolution] // Other branches don't matter because they'd all cost more
          lowestCost = completedSolution.totalCost // We know this has the lowest cost because it didn't get filtered out
          completedSolution.dead = true
          currentTree.dead = true
        } else if (!possibleSolutions.length) {
          // console.log(
          //   `This tree doesn't having any possible solutions or all possible solutions cost more than the lowest cost. Marking it dead.`
          // )
          currentTree.dead = true
        } else {
          // console.log(`Adding ${possibleSolutions.length} possible solutions to current tree`)
          currentTree.possibleSolutions = possibleSolutions
        }
      } else {
        const livingBranches = currentTree.possibleSolutions.filter((solution) => !solution.dead)

        if (!livingBranches.length) {
          // console.log(`All branches on this tree are dead, so this tree is dead too.`)
          currentTree.dead = true
        } else {
          const lowestCostBranch = livingBranches.reduce((lowestCostTree, tree) =>
            tree.totalCost < lowestCostTree.totalCost ? tree : lowestCostTree
          )

          // console.log(`We're going to explore the branch with the lowest total cost`)
          currentTree = lowestCostBranch
        }
      }
    }

    return lowestCost
  }

  function getPossibleSolutions(tree: SolutionTree): SolutionTree[] {
    const possibleSolutions: SolutionTree[] = []

    getNodes(tree.board).forEach((node) => {
      const possibleMoves = getPossibleMoves(tree.board, node)

      possibleMoves.forEach((move) => {
        const newBoard = getBoardAfterMove(tree.board, move)
        const isComplete = isCompleteBoard(newBoard)

        possibleSolutions.push({
          board: newBoard,
          dead: false,
          move,
          parent: tree,
          possibleSolutions: isComplete ? [] : null,
          totalCost: tree.totalCost + move.cost,
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
    const boardCopy = board.map((row) => row.slice())
    boardCopy[move.start[0]][move.start[1]] = '.'
    boardCopy[move.end[0]][move.end[1]] = board[move.start[0]][move.start[1]]
    return boardCopy
  }

  function getPossibleMoves(board: Board, node: Node): Move[] {
    if (isNodeFinishedMoving(board, node)) return []

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
    usedPositions = []
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
        board[position[0]][position[1]] === '.' &&
        !usedPositions.find(
          (usedPosition) => usedPosition[0] === position[0] && usedPosition[1] === position[1]
        )
    )

    if (!adjacentPositions.length) {
      return usedPositions
    }

    usedPositions.push(...adjacentPositions)

    const accessibleOpenSpaces = adjacentPositions
      .map((position) => getAccessibleOpenSpaces(board, position, usedPositions))
      .flat()
    return accessibleOpenSpaces.filter(
      (position, i) =>
        !accessibleOpenSpaces
          .slice(0, i)
          .find(
            (otherPosition) => otherPosition[0] === position[0] && otherPosition[1] === position[1]
          )
    )
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
      cost: calculateCost(end, node),
      end,
      start: [node.row, node.col],
    }
  }

  function calculateCost(end: Position, node: Node): number {
    const horizontalSpaces = Math.abs(end[1] - node.col)
    const costPerSpace = nodeToMoveCost[node.character]

    if (isHallway(node.row)) {
      return (Math.abs(end[0] - node.row) + horizontalSpaces) * costPerSpace
    } else {
      const spacesToHallway = node.row - hallwayRow
      const spacesToRoom = end[0] - hallwayRow
      return (spacesToHallway + spacesToRoom + horizontalSpaces) * costPerSpace
    }
  }

  return findLowestCost()
}

function printBoard(board: Matrix) {
  board.forEach((line) => console.log(line.join('')))
  console.log()
}

// Run from solution leaf node
function printSolution(tree: SolutionTree) {
  if (tree?.move) {
    console.log(`(working backwards) Total cost: ${tree.totalCost}`)
    printMove(tree.parent.board, tree.board, tree.move.cost)

    printSolution(tree.parent)
  } else {
    console.log('Starting board')
    printBoard(tree.board)
  }
}

function printMove(board: Board, newBoard: Board, cost: number) {
  console.log(`Previous\tNext`)
  for (let i = 0; i < board.length; i++) {
    console.log(`${board[i].join('')}\t${newBoard[i].join('')}`)
  }
  console.log(`Cost: ${cost}`)
  console.log()
}

export default dayFunction

import { createMatrix, DayFunction } from '../utilities'

const dayFunction: DayFunction = (input: string[]) => {
  let seaCucumbers: Array<string[]> = input.map((line) => line.split(''))

  function stepEast(): number {
    let timesMoved = 0
    const nextPositions = seaCucumbers.map((seaCucumberRow) => seaCucumberRow.slice())

    for (let row = 0; row < seaCucumbers.length; row++) {
      for (let col = 0; col < seaCucumbers[row].length; col++) {
        if (seaCucumbers[row][col] === '>' && seaCucumbers?.[row]?.[col + 1] === '.') {
          nextPositions[row][col] = '.'
          nextPositions[row][col + 1] = '>'
          timesMoved++
        } else if (
          seaCucumbers[row][col] === '>' &&
          col === seaCucumbers[row].length - 1 &&
          seaCucumbers[row][0] === '.'
        ) {
          nextPositions[row][col] = '.'
          nextPositions[row][0] = '>'
          timesMoved++
        }
      }
    }

    seaCucumbers = nextPositions
    return timesMoved
  }

  function stepSouth(): number {
    let timesMoved = 0
    const nextPositions = seaCucumbers.map((seaCucumberRow) => seaCucumberRow.slice())

    for (let row = 0; row < seaCucumbers.length; row++) {
      for (let col = 0; col < seaCucumbers[row].length; col++) {
        if (seaCucumbers[row][col] === 'v' && seaCucumbers?.[row + 1]?.[col] === '.') {
          nextPositions[row][col] = '.'
          nextPositions[row + 1][col] = 'v'
          timesMoved++
        } else if (
          seaCucumbers[row][col] === 'v' &&
          row === seaCucumbers.length - 1 &&
          seaCucumbers[0][col] === '.'
        ) {
          nextPositions[row][col] = '.'
          nextPositions[0][col] = 'v'
          timesMoved++
        }
      }
    }

    seaCucumbers = nextPositions
    return timesMoved
  }

  let stepsTaken = 0
  let timesMovedInAStep = 0
  do {
    timesMovedInAStep = 0
    timesMovedInAStep += stepEast()
    timesMovedInAStep += stepSouth()
    stepsTaken++
  } while (timesMovedInAStep > 0)

  return stepsTaken
}

export default dayFunction

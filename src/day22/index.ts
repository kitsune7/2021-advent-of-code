import { DayFunction } from '../utilities'

type Pair = [number, number]
type Range = [Pair, Pair, Pair]
type Instruction = {
  on: boolean
  range: Range
}

const dayFunction: DayFunction = (input: string[]) => {
  const instructions: Instruction[] = input
    .map((line) => ({
      on: line.startsWith('on'),
      range: line.split(',').map((rangeString) =>
        rangeString
          .replace(/(on|off| |[xyz]=)/g, '')
          .split('..')
          .map(Number)
      ) as Range,
    }))
    .filter((instruction) =>
      instruction.range.every((pair) => pair.every((num) => num >= -50 && num <= 50))
    )

  function countCubes(instructions: Instruction[]): number {
    let onCount = 0
    const counted: Range[] = []

    for (
      let instructionIndex = instructions.length - 1;
      instructionIndex >= 0;
      instructionIndex--
    ) {
      const instruction = instructions[instructionIndex]
      const rangeCount = countRange(instruction.range)

      if (instruction.on) {
        const overlaps: Instruction[] = []
        counted.forEach((countedRange) => {
          const overlapRange = findRangeOverlap(instruction.range, countedRange)
          if (overlapRange) {
            overlaps.push({ on: true, range: overlapRange })
          }
        })
        onCount += rangeCount - countCubes(overlaps)
      }

      counted.push(instruction.range)
    }

    return onCount
  }

  function countRange(range: Range): number {
    return (
      (range[0][1] - range[0][0] + 1) *
      (range[1][1] - range[1][0] + 1) *
      (range[2][1] - range[2][0] + 1)
    )
  }

  function findRangeOverlap(rangeA: Range, rangeB: Range): Range | null {
    const xOverlap = findPairOverlap(rangeA[0], rangeB[0])
    const yOverlap = findPairOverlap(rangeA[1], rangeB[1])
    const zOverlap = findPairOverlap(rangeA[1], rangeB[1])

    if (xOverlap && yOverlap && zOverlap) {
      return [xOverlap, yOverlap, zOverlap]
    }

    return null
  }

  function findPairOverlap(pairA: Pair, pairB: Pair): Pair | null {
    const start = Math.max(pairA[0], pairB[0])
    const end = Math.min(pairA[1], pairB[1])

    if (end - start <= 0) {
      return null
    }

    return [start, end]
  }

  return countCubes(instructions)
}

export default dayFunction

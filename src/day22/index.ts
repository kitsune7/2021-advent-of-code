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
    .reverse()
  let onCount = 0
  const counted: Range[] = []

  function countCubes() {
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i]
      const rangeCount = countRange(instruction.range)

      if (instruction.on) {
        onCount += rangeCount
        console.log(`Adding ${rangeCount} to onCount for ${instruction.range}`)

        let overlaps = []
        for (let j = 0; j < counted.length; j++) {
          const overlapRange = findRangeOverlap(instruction.range, instructions[j].range)
          if (overlapRange) {
            overlaps.push(overlapRange)
            console.log(`Found overlap of ${countRange(overlapRange)}. ${overlapRange}`)
            onCount -= countRange(overlapRange)
          }
        }

        for (let i = 0; i < overlaps.length; i++) {
          for (let j = i + 1; j < overlaps.length; j++) {
            const overlapRange = findRangeOverlap(overlaps[i], overlaps[j])
            if (overlapRange) {
              onCount += countRange(overlapRange)
            }
          }
        }
      }

      counted.push(instruction.range)
    }
  }

  function countRange(range: Range): number {
    if (!range) return 0
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
    if (pairB[0] >= pairA[0] && pairB[1] <= pairA[1]) {
      return [pairB[0], pairB[1]]
    }
    if (pairB[0] < pairA[0] && pairB[1] > pairA[1]) {
      return [pairA[0], pairA[1]]
    }
    if (pairB[0] < pairA[0] && pairB[1] >= pairA[0] && pairB[1] <= pairA[1]) {
      return [pairA[0], pairB[1]]
    }
    if (pairB[0] >= pairA[0] && pairB[0] <= pairA[1] && pairB[1] > pairA[1]) {
      return [pairB[0], pairA[1]]
    }
    return null
  }

  countCubes()
  return onCount
}

export default dayFunction

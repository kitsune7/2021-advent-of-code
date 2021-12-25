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

  function countOverlapVolume(range: Range, rangesToCheck: Range[]): number {
    console.log(`(countOverlapVolume) checking range`, range, `for overlaps with`, rangesToCheck)
    let overlapping: Range[] = []
    const rangeVolume = countRange(range)

    for (let i = 0; i < rangesToCheck.length; i++) {
      const overlap = findRangeOverlap(range, rangesToCheck[i])
      if (overlap) {
        overlapping.push(overlap)
      }
    }

    const overlapVolumes = overlapping.map((range) => countRange(range))
    overlapping = Array.from(new Set(overlapping))

    if (overlapVolumes.find((volume) => volume >= rangeVolume)) {
      return rangeVolume
    }

    const overlapVolume = overlapping.reduce(
      (total: number, overlappingRange: Range) => total + countRange(overlappingRange),
      0
    )

    let duplicateOverlapVolume = 0
    if (overlapping.length >= 2) {
      for (let i = 0; i < overlapping.length; i++) {
        duplicateOverlapVolume += countOverlapVolume(overlapping[i], overlapping.slice(i + 1))
      }
    }

    return overlapVolume - duplicateOverlapVolume
  }

  function countCubes() {
    for (let instructionIndex = 0; instructionIndex < instructions.length; instructionIndex++) {
      const instruction = instructions[instructionIndex]
      const rangeCount = countRange(instruction.range)
      console.log(`instruction`, instruction)

      if (instruction.on) {
        console.log(`rangeCount`, rangeCount)
        onCount += rangeCount
        const overlapVolume = countOverlapVolume(instruction.range, counted)
        console.log(`overlapVolume`, overlapVolume)
        if (overlapVolume < 0) {
          throw new Error(`Cannot have a negative overlap volume`)
        }
        onCount -= overlapVolume
      }

      counted.push(instruction.range)
    }
  }

  function countRange(range: Range): number {
    return (
      (range[0][1] - range[0][0] + 1) *
      (range[1][1] - range[1][0] + 1) *
      (range[2][1] - range[2][0] + 1)
    )
  }

  function findRangeOverlap(rangeA: Range, rangeB: Range): Range | null {
    if (!rangeA.length || !rangeB.length) {
      return null
    }

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

import { DayFunction } from '../utilities'

type Pair = [number, number]
type Range = [Pair, Pair, Pair]
type Instruction = {
  on: boolean
  range: Range
}

const dayFunction: DayFunction = (input: string[]) => {
  const instructions: Instruction[] = input.map((line) => ({
    on: line.startsWith('on'),
    range: line.split(',').map((rangeString) =>
      rangeString
        .replace(/(on|off| |[xyz]=)/g, '')
        .split('..')
        .map(Number)
    ) as Range,
  }))
  const countedRanges: Range[] = []
  let onCount = 0

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

  function findRangeOverlap(rangeA: Range, rangeB: Range): Range | null {
    const xOverlap = findPairOverlap(rangeA[0], rangeB[0])
    const yOverlap = findPairOverlap(rangeA[1], rangeB[1])
    const zOverlap = findPairOverlap(rangeA[1], rangeB[1])

    if (xOverlap && yOverlap && zOverlap) {
      return [xOverlap, yOverlap, zOverlap]
    }

    return null
  }

  function countRange(range: Range): number {
    if (!range) return 0
    return (
      (range[0][1] - range[0][0] + 1) *
      (range[1][1] - range[1][0] + 1) *
      (range[2][1] - range[2][0] + 1)
    )
  }

  function splitRange(range: Range, overlapRange: Range): Range[] {
    const ranges = []

    const xSplit = splitAxis(range[0], overlapRange[0])
    const xSafeRanges = xSplit.safeRanges.map((safeXRange) => [safeXRange, range[1], range[2]])
    ranges.push(...xSafeRanges)

    const ySplit = splitAxis(range[1], overlapRange[1])
    const ySafeRanges = ySplit.safeRanges.map((safeYRange) => [
      xSplit.overlapRange ?? range[0],
      safeYRange,
      range[2],
    ])
    ranges.push(...ySafeRanges)

    const zSplit = splitAxis(range[2], overlapRange[2])
    const zSafeRanges = zSplit.safeRanges.map((safeZRange) => [
      xSplit.overlapRange ?? range[0],
      ySplit.overlapRange ?? range[1],
      safeZRange,
    ])
    ranges.push(...zSafeRanges)

    return ranges
  }

  function splitAxis(
    axisRange: Pair,
    axisOverlap: Pair
  ): {
    safeRanges: Array<Pair>
    overlapRange: Pair | null
  } {
    const split = {
      safeRanges: [axisRange],
      overlapRange: null,
    }

    if (axisOverlap[0] > axisRange[0] && axisOverlap[1] < axisRange[1]) {
      split.safeRanges = [
        [axisRange[0], axisOverlap[0] - 1],
        [axisOverlap[1] + 1, axisRange[1]],
      ]
      split.overlapRange = axisOverlap
    } else if (axisOverlap[0] <= axisRange[0] && axisOverlap[1] < axisRange[1]) {
      split.safeRanges = [[axisOverlap[1] + 1, axisRange[1]]]
      split.overlapRange = [axisRange[0], axisOverlap[1]]
    } else if (axisOverlap[0] > axisRange[0] && axisOverlap[1] >= axisRange[1]) {
      split.safeRanges = [[axisRange[0], axisOverlap[0] - 1]]
      split.overlapRange = [axisOverlap[0], axisRange[1]]
    }

    return split
  }

  console.log(`split axis`, splitAxis([11, 13], [11, 12]))

  function handleOverlap({
    countedRange,
    overlapCount,
    range,
    rangeCount,
    rangeIndex,
    rangeList,
  }): number {
    const overlapRange = findRangeOverlap(range, countedRange)
    console.log(range, `overlaps ${countRange(overlapRange)} points`)
    console.log(`overlap range`, overlapRange)

    if (overlapRange) {
      overlapCount += countRange(overlapRange)
      if (overlapCount !== rangeCount) {
        const split = splitRange(range, overlapRange)
        // console.log('split', split)
        rangeList[rangeIndex] = null
        rangeList.push(...split)
      }
    }

    return overlapCount
  }

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i]
    const rangeCount = countRange(instruction.range)

    if (instruction.on) {
      onCount += rangeCount
    }

    let overlapCount = 0
    let rangeList = [instruction.range]
    for (let j = 0; j < countedRanges.length; j++) {
      rangeList.forEach((range, rangeIndex) => {
        overlapCount = handleOverlap({
          countedRange: countedRanges[j],
          overlapCount,
          range,
          rangeCount,
          rangeIndex,
          rangeList,
        })
      })
      rangeList = rangeList.filter((range) => !!range)
    }

    if (!countedRanges.length) {
      countedRanges.push(instruction.range)
    }

    if (overlapCount) {
      onCount -= overlapCount
      if (rangeList.length) {
        console.log('Adding everything in', rangeList, 'to countedRanges')
        countedRanges.push(...rangeList)
      } else if (overlapCount !== rangeCount) {
        countedRanges.push(instruction.range)
      }
    }

    console.log(`countedRanges`, countedRanges)
  }

  return onCount
}

export default dayFunction

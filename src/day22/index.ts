import { DayFunction } from "../utilities";

type Pair = [number, number];
type Range = [Pair, Pair, Pair];
type Instruction = {
  on: boolean;
  range: Range;
};

const dayFunction: DayFunction = (input: string[]) => {
  const instructions: Instruction[] = input.map((line) => ({
    on: line.startsWith("on"),
    range: line.split(",").map((rangeString) =>
      rangeString
        .replace(/(on|off| |[xyz]=)/g, "")
        .split("..")
        .map(Number)
    ) as Range,
  }));
  const countedRanges: Range[] = [];
  let onCount = 0;

  function findPairOverlap(pairA: Pair, pairB: Pair): Pair | null {
    if (pairB[0] >= pairA[0] && pairB[1] <= pairA[1]) {
      return [pairB[0], pairB[1]];
    }
    if (pairB[0] < pairA[0] && pairB[1] > pairA[1]) {
      return [pairA[0], pairA[1]];
    }
    if (pairB[0] < pairA[0] && pairB[1] >= pairA[0] && pairB[1] <= pairA[1]) {
      return [pairA[0], pairB[1]];
    }
    if (pairB[0] >= pairA[0] && pairB[0] <= pairA[1] && pairB[1] > pairA[1]) {
      return [pairB[0], pairA[1]];
    }
    return null;
  }

  function findRangeOverlap(rangeA: Range, rangeB: Range): Range | null {
    const xOverlap = findPairOverlap(rangeA[0], rangeB[0]);
    const yOverlap = findPairOverlap(rangeA[1], rangeB[1]);
    const zOverlap = findPairOverlap(rangeA[1], rangeB[1]);

    if (xOverlap && yOverlap && zOverlap) {
      return [xOverlap, yOverlap, zOverlap];
    }

    return null;
  }

  function countRange(range: Range): number {
    return (
      (range[0][1] - range[0][0] + 1) *
      (range[1][1] - range[1][0] + 1) *
      (range[2][1] - range[2][0] + 1)
    );
  }

  function splitRange(range: Range, overlapRange: Range): [Range, Range] {
    const range1x0 =
      range[0][0] < overlapRange[0][0] ? range[0][0] : overlapRange[0][1];
    const range1y0 =
      range[1][0] < overlapRange[1][0] ? range[1][0] : overlapRange[1][1];
    const range1z0 =
      range[2][0] < overlapRange[2][0] ? range[2][0] : overlapRange[2][1];

    const range2x1 =
      range[0][0] < overlapRange[0][0] ? range[0][0] : overlapRange[0][1];
    const range2y1 =
      range[1][0] < overlapRange[1][0] ? range[1][0] : overlapRange[1][1];
    const range2z1 =
      range[2][0] < overlapRange[2][0] ? range[2][0] : overlapRange[2][1];

    const range1: Range = [
      [range1x0, range[0][1]],
      [range1y0, range[1][1]],
      [range1z0, range[2][1]],
    ];
    const range2: Range = [
      [range[0][0], range2x1],
      [range[1][0], range2y1],
      [range[2][0], range2z1],
    ];

    return [range1, range2];
  }

  function handleOverlap({
    countedRange,
    overlapCount,
    range,
    rangeCount,
    splitRanges,
  }): number {
    const overlapRange = findRangeOverlap(range, countedRange);

    if (overlapRange) {
      overlapCount += countRange(overlapRange);
      if (overlapCount !== rangeCount) {
        splitRanges.push(...splitRange(range, overlapRange));
      }
    }

    return overlapCount;
  }

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const rangeCount = countRange(instruction.range);

    if (instruction.on) {
      onCount += rangeCount;
    }

    let overlapCount = 0;
    const splitRanges = [];
    for (let j = 0; j < countedRanges.length; j++) {
      if (splitRanges.length) {
        splitRanges.forEach(
          (splitRange) =>
            (overlapCount = handleOverlap({
              countedRange: countedRanges[j],
              overlapCount,
              range: splitRange,
              rangeCount,
              splitRanges,
            }))
        );
      } else {
        overlapCount = handleOverlap({
          countedRange: countedRanges[j],
          overlapCount,
          range: instruction.range,
          rangeCount,
          splitRanges,
        });
      }
    }

    if (overlapCount) {
      onCount -= overlapCount;
      if (splitRanges.length) {
        countedRanges.push(...splitRanges);
      } else if (overlapCount !== rangeCount) {
        countedRanges.push(instruction.range);
      }
    }
  }

  return onCount;
};

export default dayFunction;

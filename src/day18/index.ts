import { DayFunction } from "../utilities";

type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

const dayFunction: DayFunction = (input: string[]) => {
  const snailfishNumbers: SnailfishNumber[] = input.map((line) =>
    JSON.parse(line)
  );

  function add(a: SnailfishNumber, b: SnailfishNumber): SnailfishNumber {
    return reduce([a, b]);
  }

  function reduce(number: SnailfishNumber): SnailfishNumber {
    let numberToReduce: SnailfishNumber = JSON.parse(JSON.stringify(number));
    let explodeLocation;
    let largeIntegerIndex;

    while (
      !!(explodeLocation = findExplodeLocation(numberToReduce)) ||
      (largeIntegerIndex = findLargeIntegerIndex(numberToReduce)) !== -1
    ) {
      if (explodeLocation) {
        explode(numberToReduce, explodeLocation);
      } else if (largeIntegerIndex !== -1) {
        numberToReduce = split(numberToReduce, largeIntegerIndex);
      }
    }

    return [...numberToReduce];
  }

  function getAtLocation(
    number: SnailfishNumber,
    location: string
  ): SnailfishNumber {
    return eval(`number${location}`);
  }

  function explode(number: SnailfishNumber, location: string) {
    const [left, right] = getAtLocation(number, location);
    const previousNumberLocation = findPreviousNumberLocation(number, location);
    const nextNumberLocation = findNextNumberLocation(number, location);

    if (previousNumberLocation) {
      eval(`number${previousNumberLocation} += ${left}`);
    }
    if (nextNumberLocation) {
      eval(`number${nextNumberLocation} += ${right}`);
    }
    eval(`number${location} = 0`);
  }

  function findExplodeLocation(
    number: SnailfishNumber,
    depth = 1,
    location = ""
  ): string | null {
    if (depth > 4) {
      return location;
    }

    const leftLocation =
      typeof number[0] === "number"
        ? null
        : findExplodeLocation(number[0], depth + 1, location + "[0]");
    if (leftLocation) {
      return leftLocation;
    }

    return typeof number[1] === "number"
      ? null
      : findExplodeLocation(number[1], depth + 1, location + "[1]");
  }

  function findPreviousNumberLocation(
    number: SnailfishNumber,
    currentLocation: string
  ): string | null {
    if (currentLocation.endsWith("[1]")) {
      currentLocation =
        currentLocation.slice(0, currentLocation.length - 3) + "[0]";

      while (currentLocation.length) {
        if (typeof eval(`number${currentLocation}`) === "number") {
          return currentLocation;
        }

        currentLocation += "[1]";
      }
    } else {
      while (currentLocation.endsWith("[0]")) {
        currentLocation = currentLocation.slice(0, currentLocation.length - 3);
      }
      if (currentLocation.endsWith("[1]")) {
        currentLocation =
          currentLocation.slice(0, currentLocation.length - 3) + "[0]";

        while (currentLocation.length) {
          if (typeof eval(`number${currentLocation}`) === "number") {
            return currentLocation;
          }

          currentLocation += "[1]";
        }
      }
    }

    return null;
  }

  function findNextNumberLocation(
    number: SnailfishNumber,
    currentLocation: string
  ): string | null {
    if (currentLocation.endsWith("[0]")) {
      currentLocation =
        currentLocation.slice(0, currentLocation.length - 3) + "[1]";
      while (currentLocation.length) {
        if (typeof eval(`number${currentLocation}`) === "number") {
          return currentLocation;
        }

        currentLocation += "[0]";
      }
    } else {
      while (currentLocation.endsWith("[1]")) {
        currentLocation = currentLocation.slice(0, currentLocation.length - 3);
      }
      if (currentLocation.endsWith("[0]")) {
        currentLocation =
          currentLocation.slice(0, currentLocation.length - 3) + "[1]";

        while (currentLocation.length) {
          if (typeof eval(`number${currentLocation}`) === "number") {
            return currentLocation;
          }

          currentLocation += "[0]";
        }
      }
    }

    return null;
  }

  function findLargeIntegerIndex(number: SnailfishNumber): number {
    const frozenNumber = JSON.stringify(number);
    return frozenNumber.search(/\d{2,}/);
  }

  function split(
    number: SnailfishNumber,
    largeNumberIndex: number
  ): SnailfishNumber {
    let frozenNumber = JSON.stringify(number);
    const numberLength = frozenNumber
      .slice(largeNumberIndex)
      .match(/\d+/)[0].length;
    const integer = Number(
      frozenNumber.slice(largeNumberIndex, largeNumberIndex + numberLength)
    );
    const newPair = [Math.floor(integer / 2), Math.ceil(integer / 2)];
    frozenNumber =
      frozenNumber.slice(0, largeNumberIndex) +
      JSON.stringify(newPair) +
      frozenNumber.slice(largeNumberIndex + numberLength);

    return JSON.parse(frozenNumber);
  }

  function addInputNumbers(): SnailfishNumber {
    return snailfishNumbers.reduce((total, number) => add(total, number));
  }

  function isSimplePair(number: SnailfishNumber): number is [number, number] {
    return typeof number[0] === "number" && typeof number[1] === "number";
  }

  function magnitude(number: SnailfishNumber): number {
    if (isSimplePair(number)) {
      return number[0] * 3 + number[1] * 2;
    }

    // @ts-ignore
    return number.reduce(
      (left, right) =>
        (typeof left === "number" ? left : magnitude(left)) * 3 +
        (typeof right === "number" ? right : magnitude(right)) * 2
    );
  }

  let largestMagnitude = 0;
  for (let i = 0; i < snailfishNumbers.length; i++) {
    for (let j = 0; j < snailfishNumbers.length; j++) {
      if (j === i) continue;
      const numberMagnitude = magnitude(
        add(snailfishNumbers[i], snailfishNumbers[j])
      );
      if (numberMagnitude > largestMagnitude)
        largestMagnitude = numberMagnitude;
    }
  }

  return largestMagnitude;
};

export default dayFunction;

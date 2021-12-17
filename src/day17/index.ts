import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const ranges = input[0].replace("target area: ", "").split(", ");

  const xTargetRange = ranges[0].replace("x=", "").split("..").map(Number);
  const yTargetRange = ranges[1].replace("y=", "").split("..").map(Number);
  const lowestXVelocity = findLowestXVelocity();
  const highestXVelocity = xTargetRange[1];
  const lowestYVelocity = yTargetRange[0];
  const highestYVelocity = findHighestYVelocity();

  function findLowestXVelocity(): number {
    let count = 1;
    let xVelocity = 1;

    while (count < xTargetRange[0]) {
      xVelocity++;
      count += xVelocity;
    }

    return xVelocity;
  }

  function findHighestYVelocity(): number {
    let yVelocity = 0;

    while (velocityHitsTarget(lowestXVelocity, yVelocity)) {
      yVelocity++;
    }

    return yVelocity;
  }

  function velocityHitsTarget(
    xVelocity: number,
    yVelocity: number,
    printSteps = false
  ): boolean {
    const position = {
      x: 0,
      y: 0,
    };
    if (printSteps) console.log(position, xVelocity, yVelocity);

    while (!missedTarget(position.x, position.y, xVelocity, yVelocity)) {
      position.x += xVelocity;
      position.y += yVelocity;

      if (xVelocity !== 0) {
        xVelocity = xVelocity > 0 ? xVelocity - 1 : xVelocity + 1;
      }
      yVelocity--;

      if (printSteps) console.log(position, xVelocity, yVelocity);

      const xWithinRange =
        position.x >= xTargetRange[0] && position.x <= xTargetRange[1];
      const yWithinRange =
        position.y >= yTargetRange[0] && position.y <= yTargetRange[1];
      if (xWithinRange && yWithinRange) {
        return true;
      }
    }
    return false;
  }

  function missedTarget(x, y, xVelocity, yVelocity): boolean {
    const passedXRange = xTargetRange[0] > 0 && x > xTargetRange[1];
    const xStoppedOutsideRange =
      xVelocity === 0 && (x < xTargetRange[0] || x > xTargetRange[1]);
    const passedYRange =
      yTargetRange.every((target) => y < target) && yVelocity < 0;

    return passedXRange || xStoppedOutsideRange || passedYRange;
  }

  console.log(
    lowestXVelocity,
    highestXVelocity,
    lowestYVelocity,
    highestYVelocity
  ); // 18 202 -110 54

  let successCount = 0;
  for (let x = lowestXVelocity - 100; x <= highestXVelocity + 100; x++) {
    for (let y = lowestYVelocity - 100; y <= highestYVelocity + 100; y++) {
      if (velocityHitsTarget(x, y)) {
        successCount++;
      }
    }
  }

  return successCount;
};

export default dayFunction;

// 3118 is too low...
// 3120 is too low...

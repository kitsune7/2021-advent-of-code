import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const ranges = input[0].replace("target area: ", "").split(", ");

  const xTargetRange = ranges[0].replace("x=", "").split("..").map(Number);
  const yTargetRange = ranges[1].replace("y=", "").split("..").map(Number);
  const lowestXVelocity = findLowestXVelocity();
  // const lowestYVelocity = findLowestYVelocity();

  function findLowestXVelocity(): number {
    let count = 1;
    let xVelocity = 1;

    while (count < xTargetRange[0]) {
      xVelocity++;
      count += xVelocity;
    }

    return xVelocity;
  }

  function velocityHitsTarget(
    xVelocity: number,
    yVelocity: number,
    printSteps = false
  ): boolean | number {
    let maxY = 0;
    const position = {
      x: 0,
      y: 0,
    };
    if (printSteps) console.log(position, xVelocity, yVelocity);

    while (!missedTarget(position.x, position.y, xVelocity, yVelocity)) {
      position.x += xVelocity;
      position.y += yVelocity;

      if (position.y > maxY) maxY = position.y;

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
        return maxY;
      }
    }
    return false;
  }

  const missedTarget = (x, y, xVelocity, yVelocity): boolean => {
    const passedXRange = xTargetRange[0] > 0 && x > xTargetRange[1];
    const xStoppedOutsideRange =
      xVelocity === 0 && (x < xTargetRange[0] || x > xTargetRange[1]);
    const passedYRange =
      yTargetRange.every((target) => y < target) && yVelocity < 0;

    return passedXRange || xStoppedOutsideRange || passedYRange;
  };

  console.log(velocityHitsTarget(lowestXVelocity, 109, true));

  return;
};

export default dayFunction;

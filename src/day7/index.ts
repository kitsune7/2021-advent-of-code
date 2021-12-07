import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const positions = input[0].split(",").map((position) => Number(position));

  function distance(
    position: number,
    b: number,
    cost = 1,
    totalCost = 0
  ): number {
    const difference = Math.abs(position - b);

    if (difference !== 0) {
      if (position > b) {
        return distance(position - 1, b, cost + 1, totalCost + cost);
      }
      return distance(position + 1, b, cost + 1, totalCost + cost);
    }

    return totalCost;
  }

  const min = Math.min(...positions);
  const max = Math.max(...positions);

  let smallestFuelCost = null;

  for (let i = min; i <= max; i++) {
    const fuelCost = positions.reduce(
      (totalCost, position) => totalCost + distance(position, i),
      0
    );
    if (smallestFuelCost === null || fuelCost < smallestFuelCost) {
      smallestFuelCost = fuelCost;
    }
  }

  console.log(smallestFuelCost);
  return smallestFuelCost;
};

export default dayFunction;

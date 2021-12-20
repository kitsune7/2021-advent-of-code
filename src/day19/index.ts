import { DayFunction, incrementOrInstantiate } from "../utilities";

type Coordinate = [number, number];
type Scanner = Coordinate[];

const dayFunction: DayFunction = (input: string[]) => {
  const scanners: Scanner[] = [];

  // Setup scanner input
  let currentScanner = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith("---") && i !== 0) {
      scanners.push(currentScanner);
      currentScanner = [];
    } else if (/(-)?[0-9]+,(-)?[0-9]+/.test(input[i])) {
      currentScanner.push(input[i].split(",").map(Number));
    }
  }
  scanners.push(currentScanner);

  const distances: Record<string, number> = {};
  scanners.forEach((scanner) => {
    for (let i = 0; i < scanner.length; i++) {
      for (let j = i + 1; j < scanner.length; j++) {
        incrementOrInstantiate(
          distances,
          `${Math.abs(scanner[i][0] - scanner[j][0])},${Math.abs(
            scanner[i][1] - scanner[j][1]
          )}`
        );
      }
    }
    return distances;
  });

  const totalBeacons = Object.values(distances).reduce(
    (total, value) => total + (value > 1 ? 1 : 0),
    0
  );

  return totalBeacons;
};

export default dayFunction;

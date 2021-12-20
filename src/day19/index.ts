import { DayFunction } from "../utilities";

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

  console.log(scanners);

  return;
};

export default dayFunction;

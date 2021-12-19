import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const scanners = [];

  let currentScanner = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith("---") && i !== 0) {
      scanners.push(currentScanner);
      currentScanner = [];
    } else if (/^\d+,\d+/.test(input[i])) {
      currentScanner.push(input[i].split(",").map(Number));
    }
  }

  console.log(scanners);

  return;
};

export default dayFunction;

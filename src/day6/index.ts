import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const counts = input[0].split(",").map((count) => Number(count));

  let counterCounts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };
  counts.forEach((count) => {
    counterCounts[count]++;
  });

  function oneDayPasses() {
    const resetValue = 6;
    const newCountValue = 8;
    const newCounterCounts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };

    for (let i = newCountValue; i >= 0; i--) {
      if (i > 0) {
        newCounterCounts[i - 1] = counterCounts[i];
      } else {
        newCounterCounts[resetValue] += counterCounts[i];
        newCounterCounts[newCountValue] = counterCounts[i];
      }
    }
    counterCounts = newCounterCounts;
  }

  for (let i = 0; i < 256; i++) {
    oneDayPasses();
  }

  const total = Object.values(counterCounts).reduce(
    (total: number, counts: number) => total + counts,
    0
  );
  console.log(total);
  return total;
};

export default dayFunction;

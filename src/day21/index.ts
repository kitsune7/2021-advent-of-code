import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const p1Start = Number(input[0].split("").pop());
  const p2Start = Number(input[1].split("").pop());

  console.log(p1Start, p2Start);

  return;
};

export default dayFunction;

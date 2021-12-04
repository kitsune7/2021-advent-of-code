import { getInputLines, getDayFunction } from "./utilities";

(async function main() {
  const input = await getInputLines();
  const dayFunction = await getDayFunction();

  if (dayFunction) {
    dayFunction(input);
  } else {
    console.error("Couldn't import day function");
  }
})();

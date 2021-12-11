import { runDayFunction } from "./utilities";

(async function main() {
  const output = await runDayFunction("src/input.txt");
  console.log(output);
})();

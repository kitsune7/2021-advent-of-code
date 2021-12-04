import { getInputText, runDayFunction } from "./utilities";

(async function test() {
  const output = await runDayFunction("src/sample-input.txt");
  let expectedOutput: any = await getInputText("src/sample-output.txt");

  if (expectedOutput && !Number.isNaN(Number(expectedOutput))) {
    expectedOutput = Number(expectedOutput);
  }

  if (output !== expectedOutput) {
    console.error(`Expected: ${expectedOutput}\nActual: ${output}`);
  } else {
    console.log("All tests passed!");
  }
})();

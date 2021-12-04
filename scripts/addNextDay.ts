import { promisify } from "util";
import { exec as execWithCallback } from "child_process";
import { getLatestDay } from "../src/utilities";

const exec = promisify(execWithCallback);

(async function main() {
  const latestDay = await getLatestDay();
  if (!latestDay) {
    console.error("Couldn't figure out what the latest day is in `src`.");
    return;
  }

  exec(`cp -R src/dayTemplate src/day${latestDay + 1}`)
    .then((output) => console.log(output.stdout))
    .catch((e) => console.error(e));
})();

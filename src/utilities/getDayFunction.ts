import { readdir } from "fs/promises";

export type DayFunction = (input: string[]) => void;

export const getLatestDayDir = (): Promise<string | void> => {
  const srcPath = "src";
  const dirRegex = /^day\d+$/;

  return readdir(srcPath, { withFileTypes: true })
    .then((files) =>
      files
        .filter((file) => file.isDirectory() && dirRegex.test(file.name))
        .map((dir) => Number(dir.name.replace("day", "")))
    )
    .then((dayNumbers) => dayNumbers.sort((a, b) => (a < b ? -1 : 1)).pop())
    .then((latestDay) => `day${latestDay}`)
    .catch((e) => console.error(e));
};

export const getDayFunction = async (): Promise<DayFunction | void> => {
  const latestDayDir = await getLatestDayDir();
  const dayFunction = await import(`../${latestDayDir}/index.ts`);

  return dayFunction?.default;
};

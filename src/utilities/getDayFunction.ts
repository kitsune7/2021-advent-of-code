import { readdir } from "fs/promises";

export type DayFunction = (input: string[]) => void;

export const getLatestDayDir = async (): Promise<string> => {
  const latestDay = await getLatestDay();
  return latestDay ? `day${latestDay}` : "";
};

export const getLatestDay = (): Promise<number | void> => {
  const srcPath = "src";
  const dirRegex = /^day\d+$/;

  return readdir(srcPath, { withFileTypes: true })
    .then((files) =>
      files
        .filter((file) => file.isDirectory() && dirRegex.test(file.name))
        .map((dir) => Number(dir.name.replace("day", "")))
    )
    .then((dayNumbers) => dayNumbers.sort((a, b) => (a < b ? -1 : 1)).pop())
    .catch((e) => console.error(e));
};

export const getDayFunction = async (): Promise<DayFunction | void> => {
  const latestDayDir = await getLatestDayDir();
  const dayFunction = await import(`../${latestDayDir}/index.ts`);

  return dayFunction?.default;
};

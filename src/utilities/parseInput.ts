import { readFile } from "fs/promises";

export const getInputText = (): Promise<string | void> =>
  readFile("./input.txt")
    .then((data) => data.toString())
    .catch((e) => console.error(e));

export const getInputLines = (): Promise<string[] | null> =>
  getInputText().then((text) => (text ? text.split("\n") : null));

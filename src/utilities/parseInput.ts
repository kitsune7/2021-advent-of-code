import { readFile } from "fs/promises";

export const getInputText = (path: string): Promise<string | void> =>
  readFile(path)
    .then((data) => data.toString())
    .catch((e) => console.error(e));

export const getInputLines = (path: string): Promise<string[] | null> =>
  getInputText(path).then((text) => (text ? text.split("\n") : null));

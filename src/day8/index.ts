import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const positionToLetter = {
    top: "a",
    "top-left": "b",
    "top-right": "c",
    center: "d",
    "bottom-left": "e",
    "bottom-right": "f",
    bottom: "g",
  };
  const numberToPositions = {
    // length: 6
    0: [
      "top",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "bottom",
    ],

    // length: 2
    1: ["top-right", "bottom-right"],

    // length: 5
    2: ["top", "top-right", "center", "bottom-left", "bottom"],

    // length: 5
    3: ["top", "top-right", "center", "bottom-right", "bottom"],

    // length: 4
    4: ["top-left", "top-right", "center", "bottom-right"],

    // length: 5
    5: ["top", "top-left", "center", "bottom-right", "bottom"],

    // length: 6
    6: ["top", "top-left", "center", "bottom-left", "bottom-right", "bottom"],

    // length: 3
    7: ["top", "top-right", "bottom-right"],

    // length: 7
    8: [
      "top",
      "top-left",
      "top-right",
      "center",
      "bottom-left",
      "bottom-right",
      "bottom",
    ],

    // length: 6
    9: ["top", "top-left", "top-right", "center", "bottom-right", "bottom"],
  };

  const result = input.reduce((total, line) => {
    const patterns = line.split(" | ").shift().split(" ");
    const outputs = line.split(" | ").pop().split(" ");
    const lettersToNum = {};
    const positionToLetter = {
      top: null,
      "top-left": null,
      "top-right": null,
      center: null,
      "bottom-left": null,
      "bottom-right": null,
      bottom: null,
    };

    lettersToNum[1] = patterns.find(
      (pattern) => pattern.length === numberToPositions[1].length
    );
    lettersToNum[4] = patterns.find(
      (pattern) => pattern.length === numberToPositions[4].length
    );
    lettersToNum[7] = patterns.find(
      (pattern) => pattern.length === numberToPositions[7].length
    );
    lettersToNum[8] = patterns.find(
      (pattern) => pattern.length === numberToPositions[8].length
    );

    positionToLetter["top"] = Array.from(lettersToNum[7]).find(
      (letter) => !lettersToNum[1].includes(letter)
    );

    lettersToNum[6] = patterns.find((pattern) => {
      if (pattern.length !== 6) return false;
      return !Array.from(lettersToNum[1]).every((letter: string) =>
        pattern.includes(letter)
      );
    });

    positionToLetter["top-right"] = Array.from(lettersToNum[1]).find(
      (letter) => !lettersToNum[6].includes(letter)
    );
    positionToLetter["bottom-right"] = Array.from(lettersToNum[1]).find(
      (letter) => letter !== positionToLetter["top-right"]
    );

    lettersToNum[3] = patterns.find((pattern) => {
      if (pattern.length !== 5) return false;
      return Array.from(lettersToNum[1]).every((letter: string) =>
        pattern.includes(letter)
      );
    });

    lettersToNum[2] = patterns.find((pattern) => {
      if (pattern.length !== 5) return false;
      return !pattern.includes(positionToLetter["bottom-right"]);
    });

    lettersToNum[5] = patterns.find((pattern) => {
      if (pattern.length !== 5) return false;
      return !pattern.includes(positionToLetter["top-right"]);
    });

    positionToLetter["top-left"] = Array.from(lettersToNum[5]).find(
      (letter: string) => {
        return (
          !lettersToNum[2].includes(letter) && !lettersToNum[3].includes(letter)
        );
      }
    );

    positionToLetter["center"] = Array.from(lettersToNum[4]).find(
      (letter: string) => {
        return (
          positionToLetter["top-left"] !== letter &&
          positionToLetter["top-right"] !== letter &&
          positionToLetter["bottom-right"] !== letter
        );
      }
    );

    lettersToNum[0] = patterns.find((pattern) => {
      if (pattern.length !== 6) return false;
      return !pattern.includes(positionToLetter["center"]);
    });

    lettersToNum[9] = patterns.find((pattern) => {
      if (pattern.length !== 6) return false;
      return pattern !== lettersToNum[0] && pattern !== lettersToNum[6];
    });

    const digits = Number(
      outputs.reduce((digits, output) => {
        const number = Object.keys(lettersToNum).find((numStr) => {
          return (
            lettersToNum[numStr].length === output.length &&
            Array.from(lettersToNum[numStr]).every((letter: string) =>
              output.includes(letter)
            )
          );
        });
        return digits + number;
      }, "")
    );

    return total + digits;
  }, 0);

  return result;
};

export default dayFunction;

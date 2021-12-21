import { DayFunction, incrementOrInstantiate } from "../utilities";

type Game = {
  positions: [number, number];
  scores: [number, number];
};

const dayFunction: DayFunction = (input: string[]) => {
  const p1StartPosition = Number(input[0].split("").pop());
  const p2StartPosition = Number(input[1].split("").pop());
  const playerWinCounts = [0, 0];
  const rollTotalFrequency = {
    "3": 1,
    "4": 3,
    "5": 6,
    "6": 7,
    "7": 6,
    "8": 3,
    "9": 1,
  };

  let possibleGames = {
    [JSON.stringify({
      positions: [p1StartPosition, p2StartPosition],
      scores: [0, 0],
    })]: 1,
  };

  function updatePossibleGames(playerIndex: number) {
    const newPossibleGames = {};

    Object.keys(rollTotalFrequency).forEach((rollTotal) => {
      Object.keys(possibleGames).forEach((possibleGame) => {
        const newCount =
          possibleGames[possibleGame] * rollTotalFrequency[rollTotal];
        const game: Game = JSON.parse(possibleGame);

        game.positions[playerIndex] =
          ((Number(rollTotal) + game.positions[playerIndex] - 1) % 10) + 1;
        game.scores[playerIndex] += game.positions[playerIndex];

        if (game.scores[playerIndex] >= 21) {
          playerWinCounts[playerIndex] += newCount;
        } else {
          incrementOrInstantiate(
            newPossibleGames,
            JSON.stringify(game),
            newCount
          );
        }
      });
    });

    possibleGames = newPossibleGames;
  }

  let currentPlayerIndex = 0;
  while (Object.keys(possibleGames).length) {
    updatePossibleGames(currentPlayerIndex);

    if (currentPlayerIndex === 0) currentPlayerIndex = 1;
    else if (currentPlayerIndex === 1) currentPlayerIndex = 0;
  }

  if (playerWinCounts[0] > playerWinCounts[1]) {
    return playerWinCounts[0];
  }

  return playerWinCounts[1];
};

export default dayFunction;

// const possibleValueCount = {};
// function branch(total: number, level = 0) {
//   if (level === 1) {
//     incrementOrInstantiate(possibleValueCount, total + 1);
//     incrementOrInstantiate(possibleValueCount, total + 2);
//     incrementOrInstantiate(possibleValueCount, total + 3);
//   } else {
//     branch(total + 1, level + 1);
//     branch(total + 2, level + 1);
//     branch(total + 3, level + 1);
//   }
// }
// branch(1);
// branch(2);
// branch(3);
// console.log(possibleValueCount);

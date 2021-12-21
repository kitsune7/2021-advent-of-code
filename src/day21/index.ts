import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const players = [
    {
      position: Number(input[0].split("").pop()) - 1,
      score: 0,
    },
    {
      position: Number(input[1].split("").pop()) - 1,
      score: 0,
    },
  ];

  let timesRolled = 0;
  let deterministicDiceCounter = 1;
  const diceMax = 100;

  function getNext(): number {
    if (deterministicDiceCounter > diceMax) {
      deterministicDiceCounter = 1;
    }
    timesRolled++;
    return deterministicDiceCounter++;
  }

  function takeTurn(playerIndex: number) {
    const a = getNext();
    const b = getNext();
    const c = getNext();
    const movement = a + b + c;
    // const movement = getNext() + getNext() + getNext();

    players[playerIndex].position =
      (players[playerIndex].position + movement) % 10;
    players[playerIndex].score += players[playerIndex].position + 1;

    console.log(
      `Player ${playerIndex + 1} rolls ${a}+${b}+${c} and moves to space ${
        players[playerIndex].position + 1
      } for a total score of ${players[playerIndex].score}`
    );
  }

  let currentPlayerIndex = 0;
  while (!players.find((player) => player.score >= 1000)) {
    takeTurn(currentPlayerIndex);

    if (currentPlayerIndex === 0) currentPlayerIndex = 1;
    else if (currentPlayerIndex === 1) currentPlayerIndex = 0;
  }

  const minScore = players.reduce(
    (min, player) => (player.score < min ? player.score : min),
    Number.POSITIVE_INFINITY
  );
  console.log(players, minScore, timesRolled);

  return minScore * timesRolled;
};

export default dayFunction;

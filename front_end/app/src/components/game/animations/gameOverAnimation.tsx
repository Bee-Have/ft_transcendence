export function gameOverAnimation(winner: string) {
  const left = document.getElementById("Pong-game-left-bg") as HTMLElement;
  const right = document.getElementById("Pong-game-right-bg") as HTMLElement;

  if (left === null || right === null) return;

  left.style.setProperty("transition", "width 1s ease-in-out 1s");
  right.style.setProperty("transition", "width 1s ease-in-out 1s");
  if (winner === "player") {
    left.style.setProperty("width", "100vw");
    right.style.setProperty("width", "0vw");
  } else {
    left.style.setProperty("width", "0vw");
    right.style.setProperty("width", "100vw");
  }

  const opponentPad = document.getElementById("OpponentPad") as HTMLElement;
  const gamePad = document.getElementById("GamePad") as HTMLElement;
  const playerScoreElem = document.getElementById(
    "player-score"
  ) as HTMLElement;
  const opponentScoreElem = document.getElementById(
    "opponent-score"
  ) as HTMLElement;

  if (
    opponentPad === null ||
    gamePad === null ||
    playerScoreElem === null ||
    opponentScoreElem === null
  )
    return;

  opponentPad.style.setProperty("opacity", "0");
  gamePad.style.setProperty("opacity", "0");
  playerScoreElem.style.setProperty("opacity", "0");
  opponentScoreElem.style.setProperty("opacity", "0");
}

export function retroGameOverAnimation(winner: string) {
  const background = document.getElementById("hidden-bg-retro") as HTMLElement;

  if (winner === "player") {
    background.style.setProperty("background-color", "#6D6D6D");
  } else {
    background.style.setProperty("background-color", "#B4B4B4");
  }
  background.style.setProperty("left", "0%");
  background.style.setProperty("right", "0%");

  const opponentPad = document.getElementById("OpponentPad") as HTMLElement;
  const gamePad = document.getElementById("GamePad") as HTMLElement;
  const playerScoreElem = document.getElementById(
    "player-score"
  ) as HTMLElement;
  const opponentScoreElem = document.getElementById(
    "opponent-score"
  ) as HTMLElement;

  opponentPad.style.setProperty("opacity", "0");
  gamePad.style.setProperty("opacity", "0");
  playerScoreElem.style.setProperty("opacity", "0");
  opponentScoreElem.style.setProperty("opacity", "0");
}

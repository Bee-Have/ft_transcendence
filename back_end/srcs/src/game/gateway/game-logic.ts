import { GameInfo, BallInfo, defaultBallInfo } from "./game-info.dto";

import { Socket, Server } from "socket.io";

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function initBall() {
  const ball: BallInfo = { ...defaultBallInfo };

  let heading: number;
  let absoluteCosinus: number;

  do {
    heading = randomNumberBetween(0, 2 * Math.PI);
    absoluteCosinus = Math.abs(Math.cos(heading));
  } while (absoluteCosinus <= 0.4 || absoluteCosinus >= 0.7);

  ball.direction.x = Math.cos(heading);
  ball.direction.y = Math.sin(heading);

  return ball;
}

function ballRoutine(
  server: Server,
  currentGame: GameInfo,
  gameId: string,
  userId: number
) {
  console.log("ballRoutine");
}

function startBallRoutine(
  server: Server,
  currentGame: GameInfo,
  gameId: string,
  userId: number
) {
  if (
    currentGame.intervalId !== undefined ||
    (userId !== currentGame.player1 && userId !== currentGame.player2)
  )
    return;

  currentGame.Ball = initBall();
  const deltaTime = 1000 / 60;

  currentGame.intervalId = setInterval(() => {
    ballRoutine(server, currentGame, gameId, userId);
  }, deltaTime);
}

function scoreGoal(
  server: Server,
  currentGame: GameInfo,
  gameId: string,
  scorerId: number
) {
  if (scorerId !== currentGame.player1 && scorerId !== currentGame.player2)
    return;

  if (currentGame.intervalId !== undefined) {
    clearInterval(currentGame.intervalId);
    currentGame.intervalId = undefined;
  }

  if (scorerId === currentGame.player1) currentGame.player1Score += 1;
  else currentGame.player2Score += 1;

  server.to(gameId).emit("game:updateScore", scorerId);

  if (
    currentGame.player1Score >= currentGame.maxScore ||
    currentGame.player1Score >= currentGame.maxScore
  ) {
    const winnerId =
      currentGame.player1Score >= currentGame.maxScore
        ? currentGame.player1
        : currentGame.player2;
    server.to(gameId).emit("game:winner", winnerId);
    currentGame.gameStatus = "FINISHED";
  } else {
    setTimeout(() => {
      startBallRoutine(server, currentGame, gameId, scorerId);
    }, 1000);
  }
}

export { initBall, ballRoutine, startBallRoutine };

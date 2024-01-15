import {
  vec2,
  GameInfo,
  BallInfo,
  defaultBallInfo,
  DELTA_TIME,
  INITIAL_VELOCITY,
  MAX_VELOCITY,
} from "./game-info.dto";

import { Socket, Server } from "socket.io";

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function initBall() {
  //   const ball: BallInfo = { ...defaultBallInfo };
  let ball: BallInfo;
  ball = {
    bounceCount: 0,
    velocity: INITIAL_VELOCITY,
    position: { x: 50, y: 50 },
    direction: { x: 0, y: 0 },
  };

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

function ballRoutine(server: Server, currentGame: GameInfo, gameId: string) {
  const nextBall: BallInfo = { ...currentGame.ball };
  nextBall.position.x += nextBall.direction.x * nextBall.velocity * DELTA_TIME;
  nextBall.position.y += nextBall.direction.y * nextBall.velocity * DELTA_TIME;

  nextBall.position.x = clamp(nextBall.position.x, 1, 99);
  nextBall.position.y = clamp(nextBall.position.y, 1, 99);

  const nextBallRight = nextBall.position.x + 1;
  const nextBallLeft = nextBall.position.x - 1;
  const nextBallTop = nextBall.position.y - 1;
  const nextBallBottom = nextBall.position.y + 1;

  const currentPad: vec2 =
    nextBall.direction.x < 0
      ? { x: 5, y: currentGame.player1PadY }
      : { x: 95, y: currentGame.player2PadY };
  const padRight = currentPad.x + 1;
  const padLeft = currentPad.x - 1;
  const padTop = currentPad.y - 5;
  const padBottom = currentPad.y + 5;

  const scorerId =
    nextBall.direction.x < 0 ? currentGame.player2 : currentGame.player1;

  if (nextBallTop <= 0 || nextBallBottom >= 100) nextBall.direction.y *= -1;

  if (nextBallLeft <= 0 || nextBallRight >= 100) {
    scoreGoal(server, currentGame, gameId, scorerId);
	nextBall.position = { x: 50, y: 50 };
  } else if (
    ((padRight >= nextBallLeft && nextBall.direction.x < 0) ||
      (padLeft <= nextBallRight && nextBall.direction.x > 0)) &&
    padTop <= nextBallBottom &&
    padBottom >= nextBallTop
  ) {
    let collidePoint = nextBall.position.y - currentPad.y;
    collidePoint /= 5;

    const angleRad = (collidePoint * Math.PI) / 4;

    nextBall.direction.x = Math.cos(angleRad);
    nextBall.direction.y = Math.sin(angleRad);

    if (nextBall.position.x > 50) {
      nextBall.direction.x *= -1;
    }

    nextBall.bounceCount += 1;
    nextBall.velocity =
      nextBall.velocity + nextBall.velocity / (nextBall.bounceCount + 10);
    nextBall.velocity = clamp(
      nextBall.velocity,
      INITIAL_VELOCITY,
      MAX_VELOCITY
    );
  }

  currentGame.ball = nextBall;

  server
    .to(gameId)
    .emit("game:updateBall", currentGame.ball.position, currentGame.player2);
}

function startBallRoutine(
  server: Server,
  currentGame: GameInfo,
  gameId: string
) {
  if (
    currentGame.intervalId !== undefined ||
    currentGame.gameStatus === "FINISHED"
  )
    return;

  currentGame.ball = initBall();

  currentGame.intervalId = setInterval(() => {
    ballRoutine(server, currentGame, gameId);
  }, DELTA_TIME);
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
    currentGame.player2Score >= currentGame.maxScore
  ) {
    const winnerId =
      currentGame.player1Score >= currentGame.maxScore
        ? currentGame.player1
        : currentGame.player2;
    server.to(gameId).emit("game:winner", winnerId);
    currentGame.gameStatus = "FINISHED";
  } else {
    setTimeout(() => {
      startBallRoutine(server, currentGame, gameId);
    }, 1000);
  }
}

export { initBall, ballRoutine, startBallRoutine };

import {
  vec2,
  GameInfo,
  BallInfo,
  defaultBallInfo,
  DELTA_TIME,
  INITIAL_VELOCITY,
  MAX_VELOCITY,
} from "./game-info.dto";

import { GameService } from "../game.service";

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

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function doesBoxesCollide(box1: Box, box2: Box) {
  return (
    box1?.right >= box2?.left &&
    box1?.top <= box2?.bottom &&
    box1?.bottom >= box2?.top &&
    box1?.left <= box2?.right
  );
}

function ballRoutine(
  gameService: GameService,
  server: Server,
  currentGame: GameInfo,
  gameId: string
) {
  const nextBall: BallInfo = { ...currentGame.ball };
  nextBall.position.x += nextBall.direction.x * nextBall.velocity * DELTA_TIME;
  nextBall.position.y += nextBall.direction.y * nextBall.velocity * DELTA_TIME;

  nextBall.position.x = clamp(nextBall.position.x, 1, 99);
  nextBall.position.y = clamp(nextBall.position.y, 1, 99);

  const nextBallBox: Box = {
    left: nextBall.position.x - 1,
    right: nextBall.position.x + 1,
    top: nextBall.position.y - 1,
    bottom: nextBall.position.y + 1,
  };

  const currentPad: vec2 =
    nextBall.direction.x < 0
      ? { x: 5, y: currentGame.player1PadY }
      : { x: 95, y: currentGame.player2PadY };

  const padBox: Box = {
    left: currentPad.x - 1,
    right: currentPad.x + 1,
    top: currentPad.y - 5,
    bottom: currentPad.y + 5,
  };

  const scorerId =
    nextBall.direction.x < 0 ? currentGame.player2 : currentGame.player1;

  if (nextBallBox.top <= 0 || nextBallBox.bottom >= 100)
    nextBall.direction.y *= -1;

  if (nextBallBox.left <= 0 || nextBallBox.right >= 100) {
    scoreGoal(gameService, server, currentGame, gameId, scorerId);
    nextBall.position = { x: 50, y: 50 };
  } else if (doesBoxesCollide(padBox, nextBallBox) === true) {
    let collidePoint = nextBall.position.y - (currentPad.y + 10);
    collidePoint /= 10;

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
  gameService: GameService,
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
    ballRoutine(gameService, server, currentGame, gameId);
  }, DELTA_TIME);
}

function scoreGoal(
  gameService: GameService,
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
    currentGame.winnerId =
      currentGame.player1Score >= currentGame.maxScore
        ? currentGame.player1
        : currentGame.player2;

    gameService.deleteRunningGame(scorerId);
    gameService.createMatchHistoryItem(currentGame);
    server.to(gameId).emit("game:winner", currentGame.winnerId);
    currentGame.gameStatus = "FINISHED";
  } else {
    setTimeout(() => {
      startBallRoutine(gameService, server, currentGame, gameId);
    }, 1000);
  }
}

export { startBallRoutine };

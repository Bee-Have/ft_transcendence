import { GameInfo, BallInfo, defaultBallInfo } from "./game-info.dto";

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

function ballRoutine(currentGame: GameInfo) {
	console.log('ballRoutine');
	
}

export { initBall, ballRoutine };

interface vec2 {
  x: number;
  y: number;
}

interface BallInfo {
  bounceCount: number;
  velocity: number;
  position: vec2;
  direction: vec2;
}

const INITIAL_VELOCITY = 0.04;
const DELTA_TIME = 1000 / 60;

const defaultBallInfo: BallInfo = {
  bounceCount: 0,
  velocity: INITIAL_VELOCITY,
  position: { x: 50, y: 50 },
  direction: { x: 0, y: 0 },
};

interface GameInfo {
  player1: number | undefined;
  player2: number | undefined;

  player1PadY: number;
  player2PadY: number;

  Ball: BallInfo;
  intervalId?: ReturnType<typeof setInterval>;

  player1Score: number;
  player2Score: number;
  maxScore: number;

  gameStatus: "PREPARING" | "PLAYING" | "FINISHED";
}

const defaultGameInfo: GameInfo = {
  player1: undefined,
  player2: undefined,
  player1PadY: 0,
  player2PadY: 0,
  Ball: { ...defaultBallInfo },
  intervalId: undefined,
  player1Score: 0,
  player2Score: 0,
  maxScore: 5,
  gameStatus: "PREPARING",
};

interface UserGameId {
  userId: number;
  gameId: string;
}

interface JoinGameDto {
  player1Id: number;
  player2Id: number;
  userId: number;
}

export {
  vec2,
  BallInfo,
  defaultBallInfo,
  GameInfo,
  defaultGameInfo,
  UserGameId,
  JoinGameDto,
  INITIAL_VELOCITY,
  DELTA_TIME,
};

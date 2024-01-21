import { UserStatus } from "src/user/gateway/dto/userStatus.dto";

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

interface PadInfo {
  position: vec2;
  size: vec2;
}

const INITIAL_VELOCITY = 0.04;
const MAX_VELOCITY = 0.08;
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

  ball: BallInfo;
  intervalId?: ReturnType<typeof setInterval>;

  player1Score: number;
  player2Score: number;
  maxScore: number;

  gamemode: "classic" | "timed" | "speed" | "retro";
  dueTime?: number;
  gameStatus: "PREPARING" | "PLAYING" | "FINISHED";

  winnerId?: number;
}

const defaultGameInfo: GameInfo = {
  player1: undefined,
  player2: undefined,

  player1PadY: 0,
  player2PadY: 0,

  ball: { ...defaultBallInfo },
  intervalId: undefined,

  player1Score: 0,
  player2Score: 0,
  maxScore: 5,

  gamemode: "classic",
  gameStatus: "PREPARING",

  winnerId: undefined,
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

class MatchHistoryItemDto {
  winnerId: number | null;
  p1: {
    id: number;
    username: string;
    userstatus: UserStatus;
    photo: string;
  };
  p1Score: number;
  p2: {
    id: number;
    username: string;
    userstatus: UserStatus;
    photo: string;
  };
  p2Score: number;
  gameMode: string;
}

export {
  vec2,
  BallInfo,
  PadInfo,
  defaultBallInfo,
  GameInfo,
  defaultGameInfo,
  UserGameId,
  JoinGameDto,
  INITIAL_VELOCITY,
  MAX_VELOCITY,
  DELTA_TIME,
  MatchHistoryItemDto,
};

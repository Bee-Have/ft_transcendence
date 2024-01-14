export interface GameInfo {
  player1: number | undefined;
  player2: number | undefined;

  player1PadY: number;
  player2PadY: number;

  gameStatus: "PREPARING" | "PLAYING" | "FINISHED";
}

export const defaultGameInfo: GameInfo = {
  player1: undefined,
  player2: undefined,
  player1PadY: 0,
  player2PadY: 0,
  gameStatus: "PREPARING",
};

export interface UserGameId {
  userId: number;
  gameId: string;
}

export interface JoinGameDto {
  player1Id: number;
  player2Id: number;
  userId: number;
}

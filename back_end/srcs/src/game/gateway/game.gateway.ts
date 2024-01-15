import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import {
  vec2,
  BallInfo,
  defaultBallInfo,
  GameInfo,
  defaultGameInfo,
  UserGameId,
  JoinGameDto,
  INITIAL_VELOCITY,
} from "./game-info.dto";

import { initBall, ballRoutine, startBallRoutine } from "./game-logic";
import { GameService } from "../game.service";

@WebSocketGateway({ transports: ["websocket"], namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  private server!: Server;

  private runningGames = new Map<string, GameInfo>();
  private connectedUsers = new Map<string, UserGameId>();

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log("game connection: ", client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("game disconnect: ", client.id);
    const userGameId = this.connectedUsers.get(client.id);
    if (userGameId === undefined) return;

    this.onGameUnmount([userGameId.gameId, userGameId.userId], client);
  }

  @SubscribeMessage("game:unmount")
  onGameUnmount(
    @MessageBody() data: (string | number)[],
    @ConnectedSocket() client: Socket
  ) {
    const [gameId, userId] = data;

    const currentGame = this.runningGames.get(gameId as string);

    this.connectedUsers.delete(client.id);
    client.disconnect();

    if (currentGame === undefined) return;

    if (userId !== currentGame.player1 && userId !== currentGame.player2)
      return;

    if (currentGame.intervalId !== undefined) {
      clearInterval(currentGame.intervalId);
      currentGame.intervalId = undefined;
    }

    if (currentGame.gameStatus === "FINISHED") {
      this.runningGames.delete(gameId as string);
    } else {
      if (userId === currentGame.player1) {
        currentGame.winnerId = currentGame.player2;
      } else if (userId === currentGame.player2) {
        currentGame.winnerId = currentGame.player1;
      }

      this.gameService.createMatchHistoryItem(currentGame);
      this.server
        .to(gameId as string)
        .emit("game:winner", currentGame.winnerId);
      console.log("winner: ", currentGame.winnerId);
      currentGame.gameStatus = "FINISHED";
    }
  }

  @SubscribeMessage("game:join")
  handleJoinGame(
    @MessageBody() data: JoinGameDto,
    @ConnectedSocket() client: Socket
  ) {
    let [player1Id, player2Id, userId] = [data[0], data[1], data[2]];
    if (player1Id < player2Id)
      player1Id = [player2Id, (player2Id = player1Id)][0];

    const gameId = `${player1Id}-${player2Id}`;

    this.connectedUsers.set(client.id, { userId: userId, gameId: gameId });

    client.join(gameId);

    let currentGame = this.runningGames.get(gameId);

    if (currentGame === undefined) {
      currentGame = { ...defaultGameInfo };
      this.runningGames.set(gameId, currentGame);
    }

    if (userId === player1Id) {
      currentGame.player1 = userId;
    } else if (userId === player2Id) {
      currentGame.player2 = userId;
    } else {
      console.log("you are not a player in this game");
      client.emit(
        "game:init",
        gameId,
        currentGame.player1,
        currentGame.player2,
        currentGame.player1Score,
        currentGame.player2Score
      );
      return;
    }

    if (
      currentGame.gameStatus === "PREPARING" &&
      currentGame.player1 !== undefined &&
      currentGame.player2 !== undefined
    ) {
      console.log("!!!!game start!!!!");
      currentGame.gameStatus = "PLAYING";
      this.server
        .to(gameId)
        .emit(
          "game:init",
          gameId,
          currentGame.player1,
          currentGame.player2,
          currentGame.player1Score,
          currentGame.player2Score
        );
      setTimeout(
        () =>
          startBallRoutine(this.gameService, this.server, currentGame, gameId),
        1000
      );
    }
  }

  @SubscribeMessage("game:paddleMove")
  onGamePaddleMove(@MessageBody() data: (number | string)[]) {
    const [paddlePosition, gameId, player] = data;
    const currentGame = this.runningGames.get(gameId as string);

    if (currentGame !== undefined && player === currentGame.player1) {
      currentGame.player1PadY = paddlePosition as number;
    } else if (currentGame !== undefined && player === currentGame.player2) {
      currentGame.player2PadY = paddlePosition as number;
    }

    this.server
      .to(gameId as string)
      .emit("game:newPaddlePosition", paddlePosition, player);
  }
}

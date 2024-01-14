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
  GameInfo,
  defaultGameInfo,
  UserGameId,
  JoinGameDto,
} from "./game-info.dto";

@WebSocketGateway({ transports: ["websocket"], namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

    if (currentGame === undefined) return;

    if (userId !== currentGame.player1 && userId !== currentGame.player2)
      return;

    if (currentGame.gameStatus === "FINISHED") {
      // Need to change their status back to online.

      this.runningGames.delete(gameId as string);
    } else {
      const winnerId =
        userId === currentGame.player1
          ? currentGame.player2
          : currentGame.player1;
      console.log("winner: ", winnerId);
      currentGame.gameStatus = "FINISHED";
    }
    client.disconnect();
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
        currentGame.player2
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
        .emit("game:init", gameId, currentGame.player1, currentGame.player2);
    }
  }
}

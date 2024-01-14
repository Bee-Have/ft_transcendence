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
      currentGame = defaultGameInfo;
      this.runningGames.set(gameId, currentGame);
    }

    if (userId === player1Id) {
      currentGame.player1 = userId;
    } else if (userId === player2Id) {
      currentGame.player2 = userId;
    } else {
      console.log("you are not a player in this game");
      return;
    }

    if (
      currentGame.gameStatus === "PREPARING" &&
      currentGame.player1 !== undefined &&
      currentGame.player2 !== undefined
    ) {
      console.log("!!!!game start!!!!");
      currentGame.gameStatus = "PLAYING";
    }
  }
}

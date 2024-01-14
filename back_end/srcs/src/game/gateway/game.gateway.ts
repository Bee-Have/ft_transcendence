import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({ transports: ["websocket"], namespace: "game" })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log("game connection: ", client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("game disconnect: ", client.id);
  }
}

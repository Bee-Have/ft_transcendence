import React from "react";
import { getQueryVariable } from "../getQueryVariable";
import { io, Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

function ClassicGamePvp() {
  const player1Id: number = parseInt(getQueryVariable("player1") ?? "0");
  const player2Id: number = parseInt(getQueryVariable("player2") ?? "0");

  const gameSocket = React.useRef<Socket>();

  React.useEffect(() => {
    if (gameSocket.current === undefined) {
      gameSocket.current = io("http://localhost:3001/game", {
        transports: ["websocket"],
      });

      gameSocket.current.emit("game:join", player1Id, player2Id, userId);
    }
  }, []);

  return (
    <div>
      <h1>Player 1: {player1Id}</h1>
      <h1>Player 2: {player2Id}</h1>
      <h1>userId: {userId}</h1>
    </div>
  );
}

export default ClassicGamePvp;

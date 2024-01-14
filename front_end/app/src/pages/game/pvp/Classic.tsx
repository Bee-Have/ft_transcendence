import React from "react";
import { getQueryVariable } from "../getQueryVariable";
import { io, Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";
import { useNavigate } from "react-router-dom";

function ClassicGamePvp() {
  const navigate = useNavigate();

  const player1Id: number = parseInt(getQueryVariable("player1") ?? "0");
  const player2Id: number = parseInt(getQueryVariable("player2") ?? "0");

  const gameSocket = React.useRef<Socket>();
  const gameId = React.useRef<string>("");
  const playerId = React.useRef<number>(0);
  const opponentId = React.useRef<number>(0);

  useEffectOnce(() => {
    console.log("gameSocket.current: ", gameSocket.current);
    if (gameSocket.current === undefined) {
      gameSocket.current = io("http://localhost:3001/game", {
        transports: ["websocket"],
      });

      gameSocket.current.emit("game:join", player1Id, player2Id, userId);

      gameSocket.current.on(
        "game:init",
        (gameRoomId: string, p1: number, p2: number) => {
          gameId.current = gameRoomId;
          if (userId === p1) {
            playerId.current = p1;
            opponentId.current = p2;
          } else {
            playerId.current = p2;
            opponentId.current = p1;
          }
        }
      );

      gameSocket.current.on("game:winner", (winnerId: number) => {
        navigate("/");
      });
    }

    return () => {
      if (gameSocket.current !== undefined) {
        gameSocket.current.emit("game:unmount", gameId.current, userId);
        gameSocket.current.removeAllListeners();
      }
    };
  });

  return (
    <div>
      <h1>Player 1: {player1Id}</h1>
      <h1>Player 2: {player2Id}</h1>
      <h1>userId: {userId}</h1>
    </div>
  );
}

export default ClassicGamePvp;

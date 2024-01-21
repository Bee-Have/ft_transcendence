import { useEffect, useRef, useState } from "react";
import React from "react";
import "src/components/game/GamePad.css";
import { Socket } from "socket.io-client";

import { useEffectOnce } from "src/components/useEffectOnce";

const OpponentPaddle = ({
  gameSocket,
  gameMode,
  player2Id,
}: {
  gameSocket: Socket;
  gameMode: string;
  player2Id: number;
}) => {
  const [paddlePosition, setPaddlePosition] = useState(50);
  const paddleElem = useRef<HTMLElement | null>(null);

  useEffectOnce(() => {
    if (paddleElem.current === null) {
      paddleElem.current = document.getElementById("OpponentPad");
      gameSocket.on("game:newPaddlePosition", (newPaddlePosition, playerId) => {
        if (playerId === player2Id) {
          setPaddlePosition(newPaddlePosition);
        }
      });
    }
  });

  useEffect(() => {
    paddleElem.current?.style.setProperty(
      "--position",
      paddlePosition.toString()
    );
  });

  return <div className={gameMode === "retro" ? "RetroOpponentPad" : "OpponentPad"} id="OpponentPad"></div>;
};

export default OpponentPaddle;

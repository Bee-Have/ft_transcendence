import { useEffect, useRef, useState } from "react";
import React from "react";
import "src/components/game/GamePad.css";
import { Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

const PlayerPaddle = ({
  gameSocket,
  gameID,
  player1Id,
}: {
  gameSocket: Socket;
  gameID: string;
  player1Id: number;
}) => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const paddleElem = useRef<HTMLElement | null>(null);

  useEffectOnce(() => {
    if (paddleElem.current === null) {
      paddleElem.current = document.getElementById("GamePad");

      if (userId === player1Id) {
        document.addEventListener("mousemove", (e) => {
          setPlayerPosition(
            clamp((e.clientY / window.innerHeight) * 100, 5, 95)
          );
        });

        return () => {
          window.removeEventListener("mousemove", () => {});
        };
      } else {
        gameSocket.on(
          "game:newPaddlePosition",
          (newPaddlePosition, playerId) => {
            if (playerId === player1Id) {
              setPlayerPosition(newPaddlePosition);
            }
          }
        );
      }
    }
    return () => {};
  });

  useEffect(() => {
    paddleElem.current?.style.setProperty(
      "--position",
      playerPosition.toString()
    );

    if (userId === player1Id) {
      gameSocket.emit("game:paddleMove", playerPosition, gameID, userId);
    }
  });

  return <div className="GamePad" id="GamePad"></div>;
};

export default PlayerPaddle;

import { useEffect, useRef, useState } from "react";
import React from "react";
import "../GamePad.css";
import { Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";

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
      paddleElem.current = document.getElementById("player-paddle");

      if (userId === player1Id) {
        document.addEventListener("mousemove", (e) => {
          setPlayerPosition((e.y / window.innerHeight) * 100);
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

  return <div className="GamePad" id="player-paddle"></div>;
};

export default PlayerPaddle;

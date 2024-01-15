import { useEffect, useState, useRef } from "react";
import React from "react";
import "src/components/game/PongBall.css";
import { Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";

interface vec2 {
  x: number;
  y: number;
}

const Ball = ({
  gameSocket,
  gameID,
}: {
  gameSocket: Socket;
  gameID: string;
}) => {
  const [ballInfo, setBallInfo] = useState<vec2>({ x: 50, y: 50 });
  const ballElem = useRef<HTMLElement | null>(null);

  useEffectOnce(() => {
    if (ballElem.current === null) {
      ballElem.current = document.getElementById("PongBall");
      gameSocket.on(
        "game:ball-update",
        (ballUpdate: vec2, player2Id: number) => {
          if (player2Id === userId) {
            ballUpdate.x = 100 - ballUpdate.x;
          }
          setBallInfo(ballUpdate);
        }
      );
    }
  });

  useEffect(() => {
    ballElem.current?.style.setProperty("--positionX", ballInfo.x.toString());
    ballElem.current?.style.setProperty("--positionY", ballInfo.y.toString());
  });

  return <div className="PongBall" id="PongBall"></div>;
};

export default Ball;

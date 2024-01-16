import { useEffect, useState, useRef } from "react";
import React from "react";
import "src/components/game/PongBall.css";
import { Socket } from "socket.io-client";

import { useEffectOnce } from "src/components/useEffectOnce";

interface vec2 {
  x: number;
  y: number;
}

const Ball = ({
  gameSocket,
  mainPlayer,
}: {
  gameSocket: Socket;
  mainPlayer: number;
}) => {
  const [ballInfo, setBallInfo] = useState<vec2>({ x: 50, y: 50 });
  const ballElem = useRef<HTMLElement | null>(null);

  useEffectOnce(() => {
    if (ballElem.current === null) {
      ballElem.current = document.getElementById("PongBall");
      gameSocket.on(
        "game:updateBall",
        (ballUpdate: vec2, player2Id: number) => {
          if (player2Id === mainPlayer) {
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

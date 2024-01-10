import React from "react";
import { useEffect, useState } from "react";
import "./GamePad.css";

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function GamePad() {
  // create varible to store mouse position
  const [mousePos, setMousePos] = useState(50);

  // setup routine on "PongStart()" creation to update mouse position
  useEffect(() => {
    // console.log(mousePos);
    const PadElement = document.getElementById("GamePad") as HTMLElement;
    if (mousePos > 5 && mousePos < 95)
      PadElement.style.setProperty("--position", mousePos.toString());
  });

  // setup routine on "PongStart()" creation to get mouse position
  useEffect(() => {
    document.addEventListener("mousemove", (event) => {
      setMousePos((event.clientY / window.innerHeight) * 100);
    });
    return () => {
      // cleanup routine to remove event listener
      document.removeEventListener("mousemove", () => {});
    };
  }, []);

  return <div className="GamePad" id="GamePad"></div>;
}

function OpponentPad() {
  const paddlePosition = React.useRef(50);

  const ballSync = React.useRef(false);
  const speed = 0.02;

  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  let prevBallX = React.useRef(50);

  function computerPlaying(delta: number) {
    const paddleElem = document.getElementById("OpponentPad") as HTMLElement;
    const ballRect = document
      .getElementById("PongBall")
      ?.getBoundingClientRect() as DOMRect;
    if (ballRect === undefined) {
      return;
    }
    const ballX = (ballRect.x / window.innerHeight) * 100;
    const ballY = (ballRect.y / window.innerHeight) * 100;

    if (ballRect.x > window.innerWidth / 2 && prevBallX.current < ballX) {
      if (ballSync.current === false) {
        if (paddlePosition.current !== ballY)
          paddlePosition.current +=
            (speed * delta * (ballY - paddlePosition.current)) / 5;

        if (Math.abs(ballY - paddlePosition.current) < 1) {
          ballSync.current = true;
        }
      } else if (ballSync.current === true) {
        paddlePosition.current +=
          speed * delta * (ballY - paddlePosition.current);
      }
    } else if (prevBallX.current > ballX) {
      ballSync.current = false;
    }
    prevBallX.current = ballX;

    paddleElem?.style.setProperty(
      "--position",
      clamp(paddlePosition.current, 5, 95).toString()
    );
  }

  const animate: FrameRequestCallback = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const delta = time - previousTimeRef.current;
      computerPlaying(delta);
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, []);

  return <div className="OpponentPad" id="OpponentPad" />;
}

export default GamePad;
export { GamePad, OpponentPad };

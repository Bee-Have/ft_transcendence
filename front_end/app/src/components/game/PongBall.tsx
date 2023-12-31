import React, { useEffect } from "react";
import "./PongBall.css";
import StartGameAnimation from "./animations/startGameAnimation";

const INITIAL_VELOCITY = 0.04;

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function doesBoxesCollide(box1: DOMRect, box2: DOMRect) {
  return (
    box1?.right >= box2?.left &&
    box1?.top <= box2?.bottom &&
    box1?.bottom >= box2?.top &&
    box1?.left <= box2?.right
  );
}

function BallRoutine({
  updateScore,
}: {
  updateScore: (winner: string) => void;
}) {
  const [Position, setPosition] = React.useState({ x: 50, y: 50 });
  const Direction = React.useRef({ x: 0.5, y: 0.5 });
  const Velocity = React.useRef(INITIAL_VELOCITY);
  const BounceCount = React.useRef(0);

  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  const started = React.useRef(false);

  const resetBall = () => {
    // reset ball position/velocity
    Velocity.current = INITIAL_VELOCITY;
    BounceCount.current = 0;
    setPosition({ x: 50, y: 50 });
    Direction.current.y = 0;
    // generate random direction
    while (
      Math.abs(Direction.current.y) <= 0.4 ||
      Math.abs(Direction.current.y) >= 0.7
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      Direction.current = { x: Math.cos(heading), y: Math.sin(heading) };
    }
  };

  const handleCollision = () => {
    const ballRect = document
      .getElementById("PongBall")
      ?.getBoundingClientRect() as DOMRect;
    const playerRect = document
      .getElementById("GamePad")
      ?.getBoundingClientRect() as DOMRect;
    const opponentRect = document
      .getElementById("OpponentPad")
      ?.getBoundingClientRect() as DOMRect;

    if (ballRect === null || playerRect === null || opponentRect === null)
      return;

    let currentPaddle =
      ballRect?.x < window.innerWidth / 2 ? playerRect : opponentRect;
    let isLeftSide = currentPaddle === playerRect ? true : false;

    const paddleBorderRatio = (playerRect?.right / window.innerWidth) * 100; //?

    const windowWidthRatio = window.innerHeight / window.innerWidth;
    const ballRadius = 1; //! This value is half of the ball's css diameter.

    if (ballRect?.left <= 0) {
      // Ball touch left side of window
      updateScore("opponent");
      resetBall();
      //   Direction.current.x = Math.abs(Direction.current.x) * -1;
    } else if (ballRect?.right >= window.innerWidth) {
      // Ball touch right side of window
      updateScore("player");
      resetBall();
      //   Direction.current.x = Math.abs(Direction.current.x);
    } else if (ballRect?.bottom >= window.innerHeight) {
      // Ball touch bottom side of window
      Direction.current.y *= -1;
      //
      setPosition((prevState) => ({
        x: prevState.x,
        // PongBall.css sets position in %, '100' represents the bottom of window.innerWidth
        y: 100 - ballRadius,
      }));
    } else if (ballRect?.top <= 0) {
      // Ball touch top side of window
      Direction.current.y *= -1;
      setPosition((prevState) => ({
        x: prevState.x,
        y: ballRadius,
      }));
    } else if (doesBoxesCollide(currentPaddle, ballRect)) {
      // Ball collides with paddle
      BounceCount.current += 1;
      Velocity.current =
        Velocity.current + Velocity.current / (BounceCount.current + 10);
      if (Velocity.current > 0.08) Velocity.current = 0.08;

      let newDirection = Direction.current.x < 0 ? 1 : -1;

      let collidePoint =
        ballRect.y - (currentPaddle.y + currentPaddle.height / 2);
      collidePoint /= currentPaddle.height / 2;

      let angleRad = (collidePoint * Math.PI) / 4;

      Direction.current.x = newDirection * Math.cos(angleRad);
      Direction.current.y = Math.sin(angleRad);

      const newX = isLeftSide
        ? paddleBorderRatio + windowWidthRatio
        : 100 - paddleBorderRatio - windowWidthRatio;

      setPosition((prevState) => ({
        x: newX,
        y: prevState.y,
      }));
    }
  };

  const animate: FrameRequestCallback = (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = time - previousTimeRef.current;
      handleCollision();

      setPosition((prevState) => ({
        // multiply by deltaTime to ensure constant speed no matter the computer refresh rate
        x: prevState.x + Direction.current.x * Velocity.current * deltaTime,
        y: prevState.y + Direction.current.y * Velocity.current * deltaTime,
      }));
    }
    previousTimeRef.current = time;
    // ask for next call of animate since it is not automatic
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // If the ball goes out of the screen, this will prevent user from scrolling the page
    document.body.style.overflow = "hidden";
    resetBall();
    if (started.current === false) {
      started.current = true;
      setTimeout(() => {
        requestRef.current = requestAnimationFrame(animate);
      }, 3000);
    }
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const ballElem = document.getElementById("PongBall") as HTMLElement;
    ballElem.style.setProperty("--positionX", Position.x.toString());
    ballElem.style.setProperty("--positionY", Position.y.toString());
  });

  return (
    <div>
      <StartGameAnimation />
      <div className="PongBall" id="PongBall" />
    </div>
  );
}

export default BallRoutine;

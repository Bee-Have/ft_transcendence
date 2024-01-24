import React, { useEffect } from "react";
import "src/components/game/PongBall.css";
import StartGameAnimation from "src/components/game/animations/startGameAnimation";

const INITIAL_VELOCITY = 0.08;
const MAX_BOUNCE_ANGLE = 1.047197551; //? 60 degrees in radians

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function doesBoxesCollide(box1: DOMRect, box2: DOMRect) {
  return (
    box1.right >= box2.left &&
    box1.top <= box2.bottom &&
    box1.bottom >= box2.top &&
    box1.left <= box2.right
  );
}

function BallRoutine({
  updateScore,
}: {
  updateScore: (winner: string) => void;
}) {
  const [Position, setPosition] = React.useState({ x: 50, y: 50 });
  const Direction = React.useRef({ x: 0.5, y: 0.5 });

  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  const started = React.useRef(false);

  const resetBall = () => {
    // reset ball position/velocity
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

    if (
      ballRect === undefined ||
      playerRect === undefined ||
      opponentRect === undefined
    )
      return;
    let currentPaddle = Direction.current.x < 0 ? playerRect : opponentRect;

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
      const relativeIntersectY =
        currentPaddle.y +
        currentPaddle.height / 2 -
        (ballRect.y + ballRect.height / 2);
      const normalizedRelativeIntersectionY =
        relativeIntersectY / (currentPaddle.height / 2);
      const bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE;

      let newDirection = Direction.current.x < 0 ? 1 : -1;

      Direction.current.x = newDirection * Math.cos(bounceAngle);
      Direction.current.y = -Math.sin(bounceAngle);
    }
  };

  const animate: FrameRequestCallback = (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = time - previousTimeRef.current;
      handleCollision();

      setPosition((prevState) => ({
        // multiply by deltaTime to ensure constant speed no matter the computer refresh rate
        x: prevState.x + Direction.current.x * INITIAL_VELOCITY * deltaTime,
        y: prevState.y + Direction.current.y * INITIAL_VELOCITY * deltaTime,
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

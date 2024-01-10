import React from "react";
import "./Game.css";
import { GamePad, OpponentPad } from "../../components/game/GamePad";
import Ball from "../../components/game/PongBall";
import Score from "../../components/game/Score";
import GameOverComponent from "../../components/game/GameOverComponent";

import RedirectInvalidURL from "./RedirectInvalidURL";

import { gameOverAnimation } from "../../components/game/animations/gameOverAnimation";
import { getQueryVariable } from "./getQueryVariable";

import Card from "@mui/material/Card";

import styles from "./Timed.module.css";

function TimerCard({
  duration,
  endCallback,
}: {
  duration: number;
  endCallback: () => void;
}) {
  const [remainingTime, setRemainingTime] = React.useState(duration);
  const [isStarted, setIsStarted] = React.useState(false);

  if (isStarted === false) {
    setIsStarted(true);
    setTimeout(() => {
      setInterval(() => {
        setRemainingTime((prevState) => prevState - 1);
      }, 1000);
    }, 3000);
  }

  React.useEffect(() => {
    if (remainingTime <= 0) {
      const timerCard = document.getElementById("TimerCard");

      timerCard?.style.setProperty("bottom", "-20%");
      endCallback();
    }
    // eslint-disable-next-line
  }, [remainingTime]);

  return (
    <Card className={styles.TimerCard} id="TimerCard">
      {remainingTime > 0 ? remainingTime : 0}
    </Card>
  );
}

function TimedGame() {
  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");

  let isMulti = getQueryVariable("multi");

  const endGame = () => {
    setWinner(playerScore > opponentScore ? "player" : "opponent");
    if (playerScore === opponentScore) setWinner("everyone");
    gameOverAnimation(playerScore >= opponentScore ? "player" : "opponent");
    setTimeout(() => setGameOver(true), 2100);
  };

  if (isMulti !== "false") return <RedirectInvalidURL />;

  if (gameOver === true) {
    return (
      <GameOverComponent
        winner={winner}
        playerScore={playerScore}
        opponentScore={opponentScore}
      />
    );
  }

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  }

  return (
    <div className="Pong-game">
      <div className="Pong-game-left-bg" id="Pong-game-left-bg" />
      <div className="Pong-game-right-bg" id="Pong-game-right-bg" />
      <TimerCard duration={60} endCallback={endGame} />
      <Score player={playerScore} opponent={opponentScore} />
      <GamePad />
      <OpponentPad />
      {winner === "" && <Ball updateScore={updateScore} />}
    </div>
  );
}

export default TimedGame;

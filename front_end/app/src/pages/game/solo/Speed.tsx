import React from "react";
import "./Game.css";
import { GamePad, OpponentPad } from "src/components/game/solo/GamePad";
import Ball from "src/components/game/solo/SpeedBall";
import Score from "src/components/game/solo/Score";
import GameOverComponent from "src/components/game/GameOverComponent";

import { gameOverAnimation } from "src/components/game/animations/gameOverAnimation";

const WINNING_SCORE = 5;

function SpeedGame() {
  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");

  React.useEffect(() => {
    if (playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
      setWinner(playerScore > opponentScore ? "player" : "opponent");
      gameOverAnimation(playerScore > opponentScore ? "player" : "opponent");
      setTimeout(() => setGameOver(true), 2100);
    }
    // eslint-disable-next-line
  }, [playerScore, opponentScore]);

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
      <Score player={playerScore} opponent={opponentScore} />
      <GamePad />
      <OpponentPad />
      {winner === "" && <Ball updateScore={updateScore} />}
    </div>
  );
}

export default SpeedGame;

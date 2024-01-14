import React from "react";
import "./Retro.css";
import {
  RetroGamePad,
  RetroOpponentPad,
} from "../../../components/game/retro_game/RetroGamePad";
import RetroBall from "../../../components/game/retro_game/RetroPongBall";
import RetroScore from "../../../components/game/retro_game/RetroScore";
import GameOverComponent from "../../../components/game/GameOverComponent";

import { retroGameOverAnimation } from "../../../components/game/animations/gameOverAnimation";

const WINNING_SCORE = 1;

function RetroGame() {
  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");

  React.useEffect(() => {
    if (playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
      setWinner(playerScore > opponentScore ? "player" : "opponent");
      retroGameOverAnimation(
        playerScore > opponentScore ? "player" : "opponent"
      );
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
    <div className="Pong-game-retro">
      <div className="Pong-game-retro-hidden-bg" id="hidden-bg-retro" />
      <RetroScore player={playerScore} opponent={opponentScore} />
      <RetroGamePad />
      <RetroOpponentPad />
      {winner === "" && <RetroBall updateScore={updateScore} />}
    </div>
  );
}

export default RetroGame;

import React from "react";

import "src/pages/game/solo/Game.css";
import styles from "./GameOverComponent.module.css";

import { useNavigate } from "react-router-dom";
import IconWinningCup from "@mui/icons-material/EmojiEvents";
import Button from "@mui/material/Button";

function GameOverComponent({
  winner,
  playerScore,
  opponentScore,
}: {
  winner: String;
  playerScore: number;
  opponentScore: number;
}) {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <div
      className={
        playerScore >= opponentScore
          ? styles.GamePlayerWon
          : styles.GameOpponentWon
      }
    >
      <IconWinningCup sx={{ fontSize: "40vh" }} />
      <div className={styles.Winner}>{winner}</div>
      <div className={styles.WinMessage}>wins</div>

      <Button className={styles.HomeButton} onClick={goHome}>
        home
      </Button>
    </div>
  );
}

export default GameOverComponent;

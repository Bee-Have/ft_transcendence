import React from "react";

import "../../pages/game/Game.css";
import styles from "./GameOverComponent.module.css";

import { useNavigate } from "react-router-dom";
import IconWinningCup from "@mui/icons-material/EmojiEvents";
import Button from "@mui/material/Button";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

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

  const goHome = () => {
    socket?.emit("update-user-status", UserStatus[UserStatus.online]);
    navigate("/");
  };

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

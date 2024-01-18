import React from "react";
import { getQueryVariable } from "src/pages/game/getQueryVariable";
import { io, Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";

import "../solo/Game.css";

import DynamicBackground from "src/components/game/pvp/DynamicBackground";

import Score from "src/components/game/pvp/Score";
import Ball from "src/components/game/pvp/PongBall";
import PlayerPad from "src/components/game/pvp/PlayerPad";
import OpponentPad from "src/components/game/pvp/OpponentPad";

import GameOverComponent from "src/components/game/GameOverComponent";
import {
  gameOverAnimation,
  retroGameOverAnimation,
} from "src/components/game/animations/gameOverAnimation";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import styles from "../solo/Timed.module.css";

function TimerCard({ duration }: { duration: number }) {
  const [remainingTime, setRemainingTime] = React.useState(duration);
  const [isStarted, setIsStarted] = React.useState(false);

  if (isStarted === false) {
    setIsStarted(true);
    setInterval(() => {
      setRemainingTime((prevState) => prevState - 1);
    }, 1000);
  }

  React.useEffect(() => {
    if (remainingTime <= 0) {
      const timerCard = document.getElementById("TimerCard");

      timerCard?.style.setProperty("bottom", "-200%");
    }
    // eslint-disable-next-line
  }, [remainingTime]);

  return (
    <Card className={styles.TimerCard} id="TimerCard">
      {remainingTime > 0 ? remainingTime : 0}
    </Card>
  );
}

function GameRoomPvp() {
  const navigate = useNavigate();

  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);

  let mainPlayer = React.useRef<number>(userId);
  const player1Id: number = parseInt(getQueryVariable("player1") ?? "0");
  const player2Id: number = parseInt(getQueryVariable("player2") ?? "0");

  const gameSocket = React.useRef<Socket>();
  const gameId = React.useRef<string>("");
  const gameMode = React.useRef<string>("classic");
  const playerId = React.useRef<number>(0);
  const opponentId = React.useRef<number>(0);

  const [timeLeft, setTimeLeft] = React.useState(100);

  const [startGame, setStartGame] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");

  useEffectOnce(() => {
    if (gameSocket.current === undefined) {
      gameSocket.current = io("http://localhost:3001/game", {
        transports: ["websocket"],
      });

      gameSocket.current.emit("game:join", player1Id, player2Id, userId);

      gameSocket.current.on("game:badRequest", () => {
        navigate("/game/badRequest");
      });

      gameSocket.current.on(
        "game:init",
        (
          gameRoomId: string,
          mode: string,
          p1: number,
          p2: number,
          p1Score: number,
          p2Score: number,
          remainingTime: number
        ) => {
          if (userId !== p1 && userId !== p2) mainPlayer.current = player1Id;

          gameId.current = gameRoomId;
          gameMode.current = mode;
          setTimeLeft(Math.round(remainingTime / 1000));
          if (userId === p1 || userId === p2)
            socket?.emit("update-user-status", UserStatus[UserStatus.ingame]);
          if (mainPlayer.current === p1) {
            playerId.current = p1;
            opponentId.current = p2;
            setPlayerScore(p1Score);
            setOpponentScore(p2Score);
          } else if (mainPlayer.current === p2) {
            playerId.current = p2;
            opponentId.current = p1;
            setPlayerScore(p2Score);
            setOpponentScore(p1Score);
          }
          setStartGame(true);
        }
      );

      gameSocket.current.on("game:updateScore", (scorerId: number) => {
        if (scorerId === playerId.current) {
          setPlayerScore((prevState) => prevState + 1);
        } else if (scorerId === opponentId.current) {
          setOpponentScore((prevState) => prevState + 1);
        }
      });

      gameSocket.current.on("game:winner", (winnerId: number) => {
        gameSocket.current?.emit("game:unmount", gameId.current, userId);
        if (userId === player1Id || userId === player2Id)
          socket?.emit("update-user-status", UserStatus[UserStatus.online]);
        setWinner(winnerId === opponentId.current ? "opponent" : "player");
        if (gameMode.current === "retro")
          retroGameOverAnimation(
            winnerId === opponentId.current ? "opponent" : "player"
          );
        else
          gameOverAnimation(
            winnerId === opponentId.current ? "opponent" : "player"
          );
        setTimeout(() => setGameOver(true), 2100);
      });
    }

    return () => {
      if (gameSocket.current !== undefined) {
        gameSocket.current.emit("game:unmount", gameId.current, userId);
        if (userId === player1Id || userId === player2Id)
          socket?.emit("update-user-status", UserStatus[UserStatus.online]);
        gameSocket.current.removeAllListeners();
      }
    };
  });

  if (gameOver === true) {
    return (
      <GameOverComponent
        winner={winner}
        playerScore={playerScore}
        opponentScore={opponentScore}
      />
    );
  }
  if (gameSocket.current === undefined || startGame === false) {
    return <div>Waiting for game to start...</div>;
  }
  return (
    <div
      className={gameMode.current === "retro" ? "Pong-game-retro" : "Pong-game"}
    >
      <DynamicBackground gameMode={gameMode.current} />
      <Score
        gameMode={gameMode.current}
        player={playerScore}
        opponent={opponentScore}
      />
      {gameMode.current === "timed" && <TimerCard duration={timeLeft} />}
      {winner === "" && (
        <Ball
          gameSocket={gameSocket.current}
          gameMode={gameMode.current}
          mainPlayer={mainPlayer.current}
        />
      )}
      <PlayerPad
        gameSocket={gameSocket.current}
        gameID={gameId.current}
        gameMode={gameMode.current}
        player1Id={playerId.current}
      />
      <OpponentPad
        gameSocket={gameSocket.current}
        gameMode={gameMode.current}
        player2Id={opponentId.current}
      />
    </div>
  );
}

export default GameRoomPvp;

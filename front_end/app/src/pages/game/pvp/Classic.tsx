import React from "react";
import { getQueryVariable } from "src/pages/game/getQueryVariable";
import { io, Socket } from "socket.io-client";

import { userId } from "src/pages/global/userId";

import { useEffectOnce } from "src/components/useEffectOnce";

import "../solo/Game.css";

import Score from "src/components/game/pvp/Score";
import Ball from "src/components/game/pvp/PongBall";
import PlayerPad from "src/components/game/pvp/PlayerPad";
import OpponentPad from "src/components/game/pvp/OpponentPad";

import GameOverComponent from "src/components/game/GameOverComponent";
import { gameOverAnimation } from "src/components/game/animations/gameOverAnimation";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

function ClassicGamePvp() {
  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);

  const player1Id: number = parseInt(getQueryVariable("player1") ?? "0");
  const player2Id: number = parseInt(getQueryVariable("player2") ?? "0");

  const gameSocket = React.useRef<Socket>();
  const gameId = React.useRef<string>("");
  const playerId = React.useRef<number>(0);
  const opponentId = React.useRef<number>(0);

  const [startGame, setStartGame] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState("");

  useEffectOnce(() => {
    if (gameSocket.current === undefined) {
      gameSocket.current = io("http://localhost:3001/game", {
        transports: ["websocket"],
      });

      gameSocket.current.emit("game:join", player1Id, player2Id, userId);

      gameSocket.current.on(
        "game:init",
        (
          gameRoomId: string,
          p1: number,
          p2: number,
          p1Score: number,
          p2Score: number
        ) => {
          gameId.current = gameRoomId;
          if (userId === p1 || userId === p2)
            socket?.emit("update-user-status", UserStatus[UserStatus.ingame]);
          if (userId === p1) {
            playerId.current = p1;
            opponentId.current = p2;
          } else {
            playerId.current = p2;
            opponentId.current = p1;
          }
          setPlayerScore(p1Score);
          setOpponentScore(p2Score);
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
        setWinner(winnerId === playerId.current ? "player" : "opponent");
        gameOverAnimation(
          winnerId === playerId.current ? "player" : "opponent"
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
    <div className="Pong-game">
      <div className="Pong-game-left-bg" id="Pong-game-left-bg" />
      <div className="Pong-game-right-bg" id="Pong-game-right-bg" />
      <Score player={playerScore} opponent={opponentScore} />
      {winner === "" && (
        <Ball gameSocket={gameSocket.current} gameID={gameId.current} />
      )}
      <PlayerPad
        gameSocket={gameSocket.current}
        gameID={gameId.current}
        player1Id={playerId.current}
      />
      <OpponentPad
        gameSocket={gameSocket.current}
        player2Id={opponentId.current}
      />
    </div>
  );
}

export default ClassicGamePvp;
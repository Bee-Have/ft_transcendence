import React from "react";
import "src/components/game/Score.css";

const Score = ({
  gameMode,
  player,
  opponent,
}: {
  gameMode: string;
  player: number;
  opponent: number;
}) => {
  return (
    <div className={gameMode === "retro" ? "RetroScore" : "Score"}>
      <div className="Player" id="player-score">
        {player}
      </div>
      <div className="Opponent" id="opponent-score">
        {opponent}
      </div>
    </div>
  );
};

export default Score;

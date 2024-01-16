import React from "react";
import "src/components/game/Score.css";

const Score = ({ player, opponent }: { player: number; opponent: number }) => {
  return (
    <div className="Score">
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

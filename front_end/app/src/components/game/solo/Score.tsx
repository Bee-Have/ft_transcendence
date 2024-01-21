import React from "react";
import "src/components/game/Score.css";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

import { useEffectOnce } from "src/components/useEffectOnce";

// should be named "ScoreDisplay" since it just displays the score
const Score = ({ player, opponent }: { player: number; opponent: number }) => {
  useEffectOnce(() => {
    socket?.emit("update-user-status", UserStatus[UserStatus.ingamesolo]);

    return () => {
      socket?.emit("update-user-status", UserStatus[UserStatus.online]);
    };
  });

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

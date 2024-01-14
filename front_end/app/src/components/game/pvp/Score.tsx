import React from "react";
import "../Score.css";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

// should be named "ScoreDisplay" since it just displays the score
const Score = ({ player, opponent }: { player: number; opponent: number }) => {
  React.useEffect(() => {
    socket?.emit("update-user-status", UserStatus[UserStatus.ingame]);

    return () => {
      socket?.emit("update-user-status", UserStatus[UserStatus.online]);
    };
  }, []);

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

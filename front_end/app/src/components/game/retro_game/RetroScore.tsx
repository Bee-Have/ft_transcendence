import React from "react";
import "./RetroScore.css";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

// should be named "ScoreDisplay" since it just displays the score
const Score = ({ player, opponent }: { player: number; opponent: number }) => {
  React.useEffect(() => {
    socket?.emit("update-user-status", UserStatus[UserStatus.ingamesolo]);

    return () => {
      socket?.emit("update-user-status", UserStatus[UserStatus.online]);
    };
  }, []);

  return (
    <div className="RetroScore">
      <div id="player-score">{player}</div>
      <div id="opponent-score">{opponent}</div>
    </div>
  );
};

export default Score;

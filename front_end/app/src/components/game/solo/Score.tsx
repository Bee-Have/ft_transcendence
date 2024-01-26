import React from "react";
import "src/components/game/Score.css";

import { useSessionContext } from "src/context/SessionContext";
import { UserStatus } from "src/pages/global/friend.dto";

// should be named "ScoreDisplay" since it just displays the score
const Score = ({ player, opponent }: { player: number; opponent: number }) => {
	const session = useSessionContext();
	React.useEffect(() => {
    session.socket?.emit("update-user-status", UserStatus[UserStatus.ingamesolo]);

    return () => {
      session.socket?.emit("update-user-status", UserStatus[UserStatus.online]);
    };
  }, [session.socket]);

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

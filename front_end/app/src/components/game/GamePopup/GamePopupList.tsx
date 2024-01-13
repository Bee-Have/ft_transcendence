import React from "react";

import MatchmakingPopup from "./MatchmakingPopup";
import InvitedPopup from "./InvitedPopup";
import InvitingPopup from "./InvitingPopup";
import GamePopupProps from "./GamePopupInterface.dto";

import styles from "./GamePopup.module.css";

import { useGamePopup } from "src/context/GamePopupContext";

// import { UserStatus } from "src/pages/global/friend.dto";
import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";
import { socket } from "src/pages/global/websocket";

function GamePopupList() {
  const gamePopup = useGamePopup();
  const [popupList, setPopupList] = React.useState<GamePopupProps[]>([]);

  React.useEffect(() => {
    const fetchInvites = () => {
      gameService
        .getUserInvites(userId)
        .then((list) => {
          setPopupList(list);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    socket?.on("new-invite", fetchInvites);

    fetchInvites();
    return () => {
      socket?.off("new-invite", fetchInvites);
    };
  }, []);

  if (gamePopup.isVisible === false || popupList.length === 0) return null;

  return (
    <div className={styles.PopupList}>
      {Object.keys(popupList).map((key) => {
        if (popupList[key].receiver === undefined) {
          return (
            <MatchmakingPopup
              key={key}
              sender={popupList[key].sender}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
              acceptedInvite={popupList[key].acceptedInvite}
            />
          );
        } else if (popupList[key].sender.id === userId) {
          return (
            <InvitingPopup
              key={key}
              sender={popupList[key].sender}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
              acceptedInvite={popupList[key].acceptedInvite}
            />
          );
        } else if (popupList[key].sender.id !== userId) {
          return (
            <InvitedPopup
              key={key}
              sender={popupList[key].sender}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
              acceptedInvite={popupList[key].acceptedInvite}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default GamePopupList;

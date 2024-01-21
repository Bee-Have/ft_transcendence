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

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

function GamePopupList() {
  const gamePopup = useGamePopup();
  const [popupList, setPopupList] = React.useState<GamePopupProps[]>([]);
  const errorContext = useErrorContext();

  React.useEffect(() => {
    const fetchInvites = () => {
      gameService
        .getUserInvites(userId)
        .then((list) => {
          setPopupList(list);
        })
        .catch((error: Error | AxiosError<unknown, any>) => {
          errorContext.newError?.(errorHandler(error));
        });
    };

    socket?.on("new-invite", fetchInvites);

    if (userId !== 0) fetchInvites();
    return () => {
      socket?.off("new-invite", fetchInvites);
    };
  }, []);

  if (gamePopup.isVisible === false || popupList.length === 0) return null;

  return (
    <div className={styles.PopupList}>
      {Object.keys(popupList).map((key) => {
        if (popupList[key].receiver === undefined) {
          return <MatchmakingPopup key={key} gamePopupProps={popupList[key]} />;
        } else if (popupList[key].sender.id === userId) {
          return <InvitingPopup key={key} gamePopupProps={popupList[key]} />;
        } else if (popupList[key].sender.id !== userId) {
          return <InvitedPopup key={key} gamePopupProps={popupList[key]} />;
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default GamePopupList;

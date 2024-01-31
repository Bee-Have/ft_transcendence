import React from "react";

import MatchmakingPopup from "./MatchmakingPopup";
import InvitedPopup from "./InvitedPopup";
import InvitingPopup from "./InvitingPopup";
import GamePopupProps from "./GamePopupInterface.dto";

import styles from "./GamePopup.module.css";

import { useGamePopup } from "src/context/GamePopupContext";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";
import { useSessionContext } from "src/context/SessionContext";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

function GamePopupList() {
  const gamePopup = useGamePopup();
  const [popupList, setPopupList] = React.useState<GamePopupProps[]>([]);
  const errorContext = useErrorContext();
  const session = useSessionContext();

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

    session.socket?.on("new-invite", fetchInvites);

    if (userId !== 0) fetchInvites();
    return () => {
      session.socket?.off("new-invite", fetchInvites);
    };
  }, [session.socket, errorContext]);

  if (gamePopup.isVisible === false || popupList.length === 0) return null;

  return (
    <div className={styles.PopupList}>
      {Object.keys(popupList).map((key) => {
        if (popupList[parseInt(key)].receiver === undefined) {
          return (
            <MatchmakingPopup
              key={parseInt(key)}
              gamePopupProps={popupList[parseInt(key)]}
            />
          );
        } else if (popupList[parseInt(key)].sender.id === userId) {
          return (
            <InvitingPopup
              key={parseInt(key)}
              gamePopupProps={popupList[parseInt(key)]}
            />
          );
        } else if (popupList[parseInt(key)].sender.id !== userId) {
          return (
            <InvitedPopup
              key={parseInt(key)}
              gamePopupProps={popupList[parseInt(key)]}
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

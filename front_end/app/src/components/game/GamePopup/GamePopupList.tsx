import React from "react";

import MatchmakingPopup from "./MatchmakingPopup";
import InvitedPopup from "./InvitedPopup";
import InvitingPopup from "./InvitingPopup";
import GamePopupProps from "./GamePopupInterface.dto";

import styles from "./GamePopup.module.css";

import { useGamePopup } from "src/context/GamePopupContext";

import { UserStatus } from "src/pages/global/friend.dto";
import { userId } from "src/pages/global/userId";

function GamePopupList() {
  const gamePopup = useGamePopup();
  const [popupList, setPopupList] = React.useState<GamePopupProps[]>([]);

  React.useEffect(() => {
    setPopupList([
      {
        emitter: {
          id: 1,
          username: "emitter1",
          userstatus: UserStatus.online,
          photo: "",
        },
        gameMode: "classic",
      },
      {
        emitter: {
          id: 3,
          username: "emitter2",
          userstatus: UserStatus.online,
          photo: "",
        },
        receiver: {
          id: 4,
          username: "receiver2",
          userstatus: UserStatus.online,
          photo: "",
        },
        gameMode: "retro",
      },
      {
        emitter: {
          id: userId,
          username: "emitter2",
          userstatus: UserStatus.online,
          photo: "",
        },
        receiver: {
          id: 4,
          username: "receiver2",
          userstatus: UserStatus.online,
          photo: "",
        },
        gameMode: "timed",
      },
    ]);
  }, []);

  if (gamePopup.isVisible === false || popupList.length === 0) return null;

  return (
    <div className={styles.PopupList}>
      {Object.keys(popupList).map((key) => {
        if (popupList[key].receiver === undefined) {
          return (
            <MatchmakingPopup
              key={key}
              emitter={popupList[key].emitter}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
            />
          );
        } else if (popupList[key].emitter.id === userId) {
          return (
            <InvitingPopup
              key={key}
              emitter={popupList[key].emitter}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
            />
          );
        } else if (popupList[key].emitter.id !== userId) {
          return (
            <InvitedPopup
              key={key}
              emitter={popupList[key].emitter}
              receiver={popupList[key].receiver}
              gameMode={popupList[key].gameMode}
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

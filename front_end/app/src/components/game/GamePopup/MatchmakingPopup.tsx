import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import UnknownUser from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./GamePopup.module.css";

import GamePopupProps from "./GamePopupInterface.dto";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";

import InvitationStatusComponent from "./InvitationStatusComponent";

// receiver will be ignored since you wont know your opponent
function MatchmakingPopup({
  sender,
  receiver,
  gameMode,
  acceptedInvite,
}: GamePopupProps) {
  const closePopup = () => {
    // send an axios call to the backend to cancel the matchmaking
    // emit a socket event to refetch the popups
    gameService
      .leaveMatchmaking(userId)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card className={styles.CardPopup}>
      <CardContent>
        <div className={styles.InteractiveContent}>
          <InvitationStatusComponent
            gamePopupPros={{
              sender: sender,
              receiver: receiver,
              gameMode: gameMode,
              acceptedInvite: acceptedInvite,
            }}
          />
          <CloseIcon className={styles.CancelButton} onClick={closePopup} />
          <UnknownUser className={styles.UserIcon} />
        </div>
        <div className={styles.GameMode}>{gameMode}</div>
      </CardContent>
    </Card>
  );
}

export default MatchmakingPopup;

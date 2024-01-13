import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CircularProgress from "@mui/material/CircularProgress";

import CloseIcon from "@mui/icons-material/Close";

import styles from "./GamePopup.module.css";

import GamePopupProps from "./GamePopupInterface.dto";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";

// receiver will be ignored since you wont know your opponent
function InvitingPopup({ sender, receiver, gameMode }: GamePopupProps) {
  if (receiver === undefined) return null;

  const cancelInvite = () => {
    gameService
      .declineInvite(userId, receiver.id)
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
    // send an axios call to the backend to cancel the invite
    // emit a socket event to refetch the popups
  };

  return (
    <Card className={styles.CardPopup}>
      <CardContent>
        <div className={styles.InteractiveContent}>
          <CircularProgress className={styles.CircularProgress} />
          <CloseIcon className={styles.CancelButton} onClick={cancelInvite} />
          <InteractiveAvatar user={receiver} />
        </div>
        <div className={styles.GameMode}>{gameMode}</div>
      </CardContent>
    </Card>
  );
}

export default InvitingPopup;

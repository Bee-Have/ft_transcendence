import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CheckIcon from "@mui/icons-material/Check";

import CloseIcon from "@mui/icons-material/Close";

import styles from "./GamePopup.module.css";

import GamePopupProps from "./GamePopupInterface.dto";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";

// receiver will be ignored since you wont know your opponent
function InvitedPopup({ sender, receiver, gameMode }: GamePopupProps) {
  if (receiver === undefined) return null;

  const declineInvite = () => {
    gameService
      .declineInvite(userId, sender.id)
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
    // send an axios call to the backend to cancel the invite
    // emit a socket event to refetch the popups
  };

  const launchMatch = () => {
    // send an axios call to the backend to cancel the invite and create room
    // emit a socket event to refetch the popups
  };

  return (
    <Card className={styles.CardPopup}>
      <CardContent>
        <div className={styles.InteractiveContent}>
          <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />
          <CloseIcon className={styles.CancelButton} onClick={declineInvite} />
          <InteractiveAvatar user={sender} />
        </div>
        <div className={styles.GameMode}>{gameMode}</div>
      </CardContent>
    </Card>
  );
}

export default InvitedPopup;

import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CircularProgress from "@mui/material/CircularProgress";

import CloseIcon from "@mui/icons-material/Close";

import styles from "./GamePopup.module.css";

import GamePopupProps from "./GamePopupInterface.dto";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";

// receiver will be ignored since you wont know your opponent
function InvitedPopup({ emitter, receiver, gameMode }: GamePopupProps) {
  if (receiver === undefined) return null;

  const closePopup = () => {
    // send an axios call to the backend to cancel the invite
    // emit a socket event to refetch the popups
  };

  return (
    <Card className={styles.CardPopup}>
      <CardContent>
        <div className={styles.InteractiveContent}>
          <CircularProgress className={styles.CircularProgress} />
          <CloseIcon className={styles.CancelButton} onClick={closePopup} />
          <InteractiveAvatar user={receiver} />
        </div>
        <div className={styles.GameMode}>{gameMode}</div>
      </CardContent>
    </Card>
  );
}

export default InvitedPopup;

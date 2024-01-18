import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CloseIcon from "@mui/icons-material/Close";

import styles from "./GamePopup.module.css";

import GamePopupProps from "./GamePopupInterface.dto";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

import InvitationStatusComponent from "./InvitationStatusComponent";

// receiver will be ignored since you wont know your opponent
function InvitingPopup({ gamePopupProps }: { gamePopupProps: GamePopupProps }) {
  if (gamePopupProps.receiver === undefined) return null;
  const errorContext = useErrorContext();

  const cancelInvite = () => {
    gameService
      .declineInvite(userId, gamePopupProps.receiver?.id ?? 0)
      .then((res) => {})
      .catch((error: Error | AxiosError<unknown, any>) => {
        errorContext.newError?.(errorHandler(error));
      });
    // send an axios call to the backend to cancel the invite
    // emit a socket event to refetch the popups
  };

  return (
    <Card className={styles.CardPopup}>
      <CardContent>
        <div className={styles.InteractiveContent}>
          <InvitationStatusComponent gamePopupProps={gamePopupProps} />
          <CloseIcon className={styles.CancelButton} onClick={cancelInvite} />
          <InteractiveAvatar user={gamePopupProps.receiver} />
        </div>
        <div className={styles.GameMode}>{gamePopupProps.gameMode}</div>
      </CardContent>
    </Card>
  );
}

export default InvitingPopup;

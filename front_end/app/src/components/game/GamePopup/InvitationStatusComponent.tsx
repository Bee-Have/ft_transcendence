import React from "react";

import GamePopupProps from "./GamePopupInterface.dto";
import { userId } from "src/pages/global/userId";

import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./GamePopup.module.css";

import { useNavigate } from "react-router-dom";

import gameService from "src/services/game";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";
// import { CountdownCircleTimer } from "react-countdown-circle-timer";

function InvitationStatusComponent({
  gamePopupProps,
  launchMatch,
}: {
  gamePopupProps: GamePopupProps;
  launchMatch?: () => void;
}) {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = React.useState<boolean>(false);
  const errorContext = useErrorContext();

  React.useEffect(() => {
    if (gamePopupProps.acceptedInvite === true) {
      setIsAccepted(true);
    }
  }, [gamePopupProps.acceptedInvite]);

  React.useEffect(() => {
    if (isAccepted === true) {
      let gameUrl =
        "/game/" +
        gamePopupProps.gameMode +
        "?player1=" +
        (userId === gamePopupProps.sender.id
          ? gamePopupProps.sender.id
          : gamePopupProps.receiver?.id) +
        "&player2=" +
        (userId === gamePopupProps.sender.id
          ? gamePopupProps.receiver?.id
          : gamePopupProps.sender.id);

      navigate(gameUrl);
      gameService
        .deleteUserInvites(userId)
        .then((res) => {
          setIsAccepted(false);
        })
        .catch((err: Error | AxiosError) => {
          errorContext.newError?.(errorHandler(err));
          navigate("/");
        });
    }
  }, [isAccepted]);

  if (gamePopupProps.sender.id === userId) {
    return <CircularProgress className={styles.CircularProgress} />;
  } else {
    return <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />;
  }
}

export default InvitationStatusComponent;

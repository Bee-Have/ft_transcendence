import React from "react";

import GamePopupProps from "./GamePopupInterface.dto";
import { userId } from "src/pages/global/userId";

import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./GamePopup.module.css";

import { useNavigate } from "react-router-dom";

function InvitationStatusComponent({
  gamePopupProps,
  launchMatch,
}: {
  gamePopupProps: GamePopupProps;
  launchMatch?: () => void;
}) {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (gamePopupProps.acceptedInvite === true) {
      setIsAccepted(true);
    }
  }, [gamePopupProps.acceptedInvite]);

  React.useEffect(() => {
    if (isAccepted === true) {
      let redirectUrl =
        "/game/redirect"  +
        "?player1=" +
        (userId === gamePopupProps.sender.id
          ? gamePopupProps.sender.id
          : gamePopupProps.receiver?.id) +
        "&player2=" +
        (userId === gamePopupProps.sender.id
          ? gamePopupProps.receiver?.id
          : gamePopupProps.sender.id)

      navigate(redirectUrl);
      setIsAccepted(false);
    }
	// eslint-disable-next-line
  }, [isAccepted]);

  if (gamePopupProps.sender.id === userId) {
    return <CircularProgress />;
  } else {
    return <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />;
  }
}

export default InvitationStatusComponent;

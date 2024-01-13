import React from "react";

import GamePopupProps from "./GamePopupInterface.dto";
import { userId } from "src/pages/global/userId";

import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./GamePopup.module.css";

function InvitationStatusComponent({
  gamePopupProps,
  launchMatch,
}: {
  gamePopupProps: GamePopupProps;
  launchMatch?: () => void;
}) {
  if (gamePopupProps.sender.id === userId) {
    return <CircularProgress className={styles.CircularProgress} />;
  } else {
    return <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />;
  }
}

export default InvitationStatusComponent;

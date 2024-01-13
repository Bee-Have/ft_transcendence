import React from "react";

import GamePopupProps from "./GamePopupInterface.dto";
import { userId } from "src/pages/global/userId";

import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./GamePopup.module.css";

function InvitationStatusComponent({
  gamePopupPros,
  launchMatch,
}: {
  gamePopupPros: GamePopupProps;
  launchMatch?: () => void;
}) {
  if (gamePopupPros.sender.id === userId) {
    return <CircularProgress className={styles.CircularProgress} />;
  } else {
    return <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />;
  }
}

export default InvitationStatusComponent;

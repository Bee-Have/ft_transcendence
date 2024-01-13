import React from "react";

import GamePopupProps from "./GamePopupInterface.dto";
import { userId } from "src/pages/global/userId";

import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./GamePopup.module.css";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

function InvitationStatusComponent({
  gamePopupProps,
  launchMatch,
}: {
  gamePopupProps: GamePopupProps;
  launchMatch?: () => void;
}) {
  const [isAccepted, setIsAccepted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (gamePopupProps.acceptedInvite === true) {
      setIsAccepted(true);
    }
  }, [gamePopupProps.acceptedInvite]);

  if (isAccepted === true) {
    return (
      <CountdownCircleTimer
        isPlaying
        duration={5}
        colors={["#00FF00", "#FF0000"]}
        colorsTime={[5, 0]}
        strokeLinecap="square"
        trailColor="#abc"
        onComplete={() => {
          console.log("done");
        }}
        size={60}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    );
  }
  if (gamePopupProps.sender.id === userId) {
    return <CircularProgress className={styles.CircularProgress} />;
  } else {
    return <CheckIcon className={styles.ApproveButton} onClick={launchMatch} />;
  }
}

export default InvitationStatusComponent;

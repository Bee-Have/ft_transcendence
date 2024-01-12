import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";

import { Friend, UserStatus } from "../pages/global/friend.dto";

interface InviteSpectateButtonProps {
  user: Friend;
}

function InviteSpectateButton({ user }: InviteSpectateButtonProps) {
  const navigate = useNavigate();

  const handleSpectate = () => {
    navigate("/game/" + user.username);
  };

  if (
    user.userstatus === UserStatus.ingame ||
    user.userstatus === UserStatus.ingamesolo
  ) {
    return (
      <Button
        disabled={user.userstatus === UserStatus.ingamesolo}
        className={styles.ButtonDialogOpen}
        onClick={handleSpectate}
      >
        spectate
      </Button>
    );
  } else if (user.userstatus !== UserStatus.offline) {
    return <InviteGameModeDialogButton user={user} />;
  } else {
    return null;
  }
}

export default InviteSpectateButton;

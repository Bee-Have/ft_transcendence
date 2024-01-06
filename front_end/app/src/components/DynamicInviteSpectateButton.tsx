import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";

import { Friend } from "../pages/global/friend.dto";

interface InviteSpectateButtonProps {
  user: Friend;
}

function InviteSpectateButton({ user }: InviteSpectateButtonProps) {
  const navigate = useNavigate();

  const handleSpectate = () => {
    navigate("/game/" + user.username);
  };

  if (user.status === "playing") {
    return (
      <Button className={styles.ButtonDialogOpen} onClick={handleSpectate}>
        spectate
      </Button>
    );
  } else if (user.status === "online") {
    return <InviteGameModeDialogButton user={user} />;
  } else {
    return null;
  }
}

export default InviteSpectateButton;

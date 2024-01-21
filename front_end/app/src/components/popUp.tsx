import React from "react";

import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import InviteSpectateButton from "./DynamicInviteSpectateButton";
import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";
import Menu from "@mui/material/Menu";

import { Friend } from "../pages/global/friend.dto";

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";

interface PopUpProps {
  user: Friend;
  isFriend: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (event: HTMLElement | null) => void;
}

function PopUp({ user, isFriend, anchorEl, setAnchorEl }: PopUpProps) {
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/profil")}
      >
        profile
      </Button>

      {isFriend === true && <InviteSpectateButton user={user} />}
      {isFriend === false && <InviteGameModeDialogButton user={user} />}

      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/chat")}
      >
        chat
      </Button>

      <Button className={styles.ButtonDialogOpen} onClick={handleClose}>
        add friend
      </Button>
    </Menu>
  );
}

export default PopUp;

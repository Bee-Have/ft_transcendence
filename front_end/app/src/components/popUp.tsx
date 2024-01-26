import React from "react";

import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import InviteSpectateButton from "./DynamicInviteSpectateButton";
import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";
import Menu from "@mui/material/Menu";

import { Friend } from "../pages/global/friend.dto";

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { BACKEND_URL } from "src/pages/global/env";
import axios from "axios";

interface PopUpProps {
  user: Friend;
  usage: "stranger" | "friend" | "invite";
  anchorEl: HTMLElement | null;
  setAnchorEl: (event: HTMLElement | null) => void;
}

function PopUp({ user, usage, anchorEl, setAnchorEl }: PopUpProps) {
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

	const errorContext = useErrorContext();

	const sendFriendRequest = () => {
		axios.get(BACKEND_URL + '/user/friend/create/' + user.id,
			{ withCredentials: true })
			.then((res) => { })
			.catch((e) => { errorContext.newError?.(errorHandler(e)); })
		handleClose()
	}

	const chatWithUser = () => {
		axios.post(BACKEND_URL + '/privatemessage/conversations/' + user.id, {}, { withCredentials: true })
			.then((res) => {
				navigate("/chat/" + res.data.conversation.id)
			})
			.catch((e) => {
				errorContext.newError?.(errorHandler(e))
			})
		handleClose()
	}


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
        onClick={() => navigate(`/profil/${user.id}`)}
      >
        Profile
      </Button>

      {usage === "friend" && <InviteSpectateButton user={user} />}
      {usage === "stranger" && <InviteGameModeDialogButton user={user} />}

      <Button
        className={styles.ButtonDialogOpen}
        onClick={chatWithUser}
      >
        Chat
      </Button>

      {usage !== "friend" && 
      <Button className={styles.ButtonDialogOpen} onClick={sendFriendRequest}>
        Add friend </Button>}
    </Menu>
  );
}

export default PopUp;

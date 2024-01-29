import React from "react";

import PopUp from "../popUp";
import { Avatar } from "@mui/material";

import { Friend } from "src/pages/global/friend.dto";

import styles from "./InteractiveAvatar.module.css";

function InteractiveAvatar({
  user,
  usage = "friend",
}: {
  user: Friend;
  usage?: "stranger" | "friend" | "invite";
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Avatar
        src={user.photo}
        alt={user.username}
        onClick={(event) => {setAnchorEl(event.currentTarget);}}
        className={styles.InteractiveAvatar}
      />
      <PopUp
        user={user}
        usage={usage}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}

export default InteractiveAvatar;

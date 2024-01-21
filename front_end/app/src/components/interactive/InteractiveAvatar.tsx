import React from "react";

import PopUp from "../popUp";
import { Avatar } from "@mui/material";

import { Friend } from "src/pages/global/friend.dto";

import styles from "./InteractiveAvatar.module.css";

function InteractiveAvatar({
  user,
  isFriend = true,
}: {
  user: Friend;
  isFriend?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Avatar
        src={user.photo}
        alt={user.username}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className={styles.InteractiveAvatar}
      />
      <PopUp
        user={user}
        isFriend={isFriend}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}

export default InteractiveAvatar;

import React from "react";

import PopUp from "../popUp";

import { Friend } from "src/pages/global/friend.dto";

import styles from "./InteractiveUsername.module.css";

function InteractiveUsername({
  user,
  isFriend = true,
}: {
  user: Friend;
  isFriend?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <h1
        className={styles.InteractiveUsername}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {user.username}
      </h1>
      <PopUp
        user={user}
        isFriend={isFriend}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}

export default InteractiveUsername;

import React from "react";

import PopUp from "../popUp";

import { Friend } from "src/pages/global/friend.dto";

import styles from "./InteractiveUsername.module.css";

function InteractiveUsername({
  user,
  usage = "friend",
}: {
  user: Friend;
  usage?: "stranger" | "friend" | "invite";
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
        usage={usage}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}

export default InteractiveUsername;

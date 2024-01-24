import React from "react";

import PopUp from "../popUp";
import { Avatar } from "@mui/material";

import { Friend } from "src/pages/global/friend.dto";

import styles from "./InteractiveAvatar.module.css";
import { useNavigate } from "react-router";

// import { PHOTO_FETCH_URL } from "src/pages/global/env";
function InteractiveAvatar({
  user,
  usage = "friend",
}: {
  user: Friend;
  usage?: "stranger" | "friend" | "invite";
}) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Avatar
        src={user.photo}
        // src= PHOTO_FETCH_URL + user.id
        alt={user.username}
        //onClick={() => navigate(`/profil/${user.id}`)}
        onClick={(event) => {setAnchorEl(event.currentTarget);  navigate(`/profil/${user.id}`)}}
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

import { Avatar } from "@mui/material";
import React from "react";
import { BACKEND_URL } from "src/pages/global/env";
import styles from "../../../components/interactive/InteractiveAvatar.module.css";
import { MemberProps } from "../types/MemberProps.types";
import PopUpChannel from "./PopUpChannel";



function InteractiveAvatarChannel({ member, clicker }: { member: MemberProps, clicker: MemberProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Avatar
        src={BACKEND_URL + "/user/image/" + member.userId}
        alt={member.username}
		onClick={(event) => setAnchorEl(event.currentTarget)}
		className={styles.InteractiveAvatar}
      />
      <PopUpChannel member={member} clicker={clicker} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
}

export default InteractiveAvatarChannel;


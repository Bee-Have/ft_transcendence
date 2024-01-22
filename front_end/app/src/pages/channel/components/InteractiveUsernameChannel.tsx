import React from "react";
import styles from "src/components/interactive/InteractiveUsername.module.css";
import { MemberProps } from "../types/MemberProps.types";
import PopUpChannel from "./PopUpChannel";

function InteractiveUsernameChannel({ member, clicker }: { member: MemberProps, clicker: MemberProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <h1
        className={styles.InteractiveUsername}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {member.username}
      </h1>
      <PopUpChannel member={member} clicker={clicker} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
}

export default InteractiveUsernameChannel;

import React, { useState } from "react";
import styles from "src/components/interactive/InteractiveUsername.module.css";
import { MemberProps } from "../types/MemberProps.types";
import PopUpChannel from "./PopUpChannel";

function InteractiveUsernameChannel({ member, clicker }: { member: MemberProps, clicker: MemberProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [memberIsBlocked, setMemberIsBlocked] = useState(member.isMemberBlockedByuser)
  const [memberIsFriend, setMemberIsFriend] = useState(member.isMemberFriendWithUser)


  return (
    <>
      <h1
        className={styles.InteractiveUsername}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {member.username}
      </h1>
      <PopUpChannel
        member={member}
        clicker={clicker}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        memberIsBlocked={memberIsBlocked}
        setMemberIsBlocked={setMemberIsBlocked}
        memberIsFriend={memberIsFriend}
        setMemberIsFriend={setMemberIsFriend} />
    </>
  );
}

export default InteractiveUsernameChannel;

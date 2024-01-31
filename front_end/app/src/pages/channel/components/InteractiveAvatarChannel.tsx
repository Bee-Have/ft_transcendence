import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { BACKEND_URL } from "src/pages/global/env";
import styles from "../../../components/interactive/InteractiveAvatar.module.css";
import { MemberProps } from "../types/MemberProps.types";
import PopUpChannel from "./PopUpChannel";



function InteractiveAvatarChannel({ member, clicker }: { member: MemberProps, clicker: MemberProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [memberIsBlocked, setMemberIsBlocked] = useState(member.isMemberBlockedByuser)
  const [memberIsFriend, setMemberIsFriend] = useState(member.isMemberFriendWithUser)

  return (
    <>
      <Avatar
        src={BACKEND_URL + "/user/image/" + member.userId}
        alt={member.username}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className={styles.InteractiveAvatar}
      />
      <PopUpChannel
        member={member}
        clicker={clicker}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        memberIsBlocked={memberIsBlocked}
        setMemberIsBlocked={setMemberIsBlocked}
        memberIsFriend={memberIsFriend}
        setMemberIsFriend={setMemberIsFriend}  />
    </>
  );
}

export default InteractiveAvatarChannel;


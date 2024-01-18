import React from "react";
import styles from "src/components/interactive/InteractiveUsername.module.css";
import PopUpConversation from "./PopUpConversation";
import { ConversationProps } from "../types/ConversationProps.types";

function InteractiveUsernameConversation({ chat }: {chat: ConversationProps} ) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	console.log(chat)
	const mem = {
		userId: chat.conversation.friendId,
		username: chat.conversation.friendUsername,
		memberId: -1, //TODO ASK MEMBERID

	}

  return (
    <>
      <h1
        className={styles.InteractiveUsername}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {chat.conversation.friendUsername}
      </h1>
      <PopUpConversation member={mem} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
}

export default InteractiveUsernameConversation;

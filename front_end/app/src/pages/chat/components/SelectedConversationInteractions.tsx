import List from "@mui/material/List";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import InviteSpectateButton from "src/components/DynamicInviteSpectateButton";
import styles from "src/components/game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { BACKEND_URL, PHOTO_FETCH_URL } from "../../global/env";
import axios from "axios";

import { ConversationProps } from "../types/ConversationProps.types";
import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";

function SelectedConversationInterations({
  data,
  setConvs
}: {
  data: ConversationProps;
  setConvs: any
}) {
  const navigate = useNavigate();

  return (
    <List>
      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/profil/" + data.conversation.friendId)}
      >
        Profil
      </Button>

      <InviteSpectateButton
        user={{
          id: data.conversation.friendId,
          username: data.conversation.friendUsername,
          userstatus: data.userstatus,
          photo: PHOTO_FETCH_URL + data.conversation.friendId,
        }}
      />

      <AddFriendButton member={data} handleClose={() => {}} setConvs={setConvs} />
      <BlockUserButton member={data} handleClose={() => {}} setConvs={setConvs} />
    </List>
  );
}


const AddFriendButton = ({ member, handleClose, setConvs }: any) => {

	const errorContext = useErrorContext()

  const sendFriendRequest = () => {
    axios
      .get(BACKEND_URL + "/user/friend/create/" + member.conversation.friendId, {
        withCredentials: true,
      })
      .then((res) => {
        const up = {...member}
        up.conversation.isMemberFriendWithUser = true
        setConvs(up)
      })
      .catch((e) => {
        errorContext.newError?.(errorHandler(e));
      });
    handleClose();
  };

  return (
    <>
      {!member.conversation.isMemberFriendWithUser && <PopUpButton name={"Add Friend"} callback={sendFriendRequest} />}
    </>
  );
};

const BlockUserButton = ({ member, handleClose, setConvs }: any) => {

	const errorContext = useErrorContext();

	const blockUser = () => {

		const Url = BACKEND_URL + '/user/friend/' + (member.conversation.isMemberBlockedByuser ? "unblock/" : "block/") + member.conversation.friendId

		axios.post(Url, {}, { withCredentials: true })
			.then((res) => {
				const up = {...member}
        up.conversation.isMemberBlockedByuser = !member.conversation.isMemberBlockedByuser
        setConvs(up)
			})
			.catch((e) => {
				errorContext.newError?.(errorHandler(e))
			})
		handleClose()
	}

	return (
		<>
			{ <PopUpButton name={member.conversation.isMemberBlockedByuser ? "Unblock" : "Block"} callback={blockUser} />}
		</>
	)
};

const PopUpButton = ({
  name,
  callback,
}: {
  name: string;
  callback: (...args: any[]) => any;
}) => {
  return (
    <Button className={styles.ButtonDialogOpen} onClick={callback}>
      {name}
    </Button>
  );
};

export default SelectedConversationInterations;

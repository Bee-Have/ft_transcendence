import List from "@mui/material/List";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import InviteSpectateButton from "src/components/DynamicInviteSpectateButton";
import styles from "src/components/game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { BACKEND_URL, PHOTO_FETCH_URL } from "../../global/env";
import axios from "axios";

import { ConversationProps } from "../types/ConversationProps.types";

function SelectedConversationInterations({
  data,
}: {
  data: ConversationProps;
}) {
  const navigate = useNavigate();

  return (
    <List>
      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/profil")}
      >
        {/* TODO */}
        Profile
      </Button>

      <InviteSpectateButton
        user={{
          id: data.conversation.friendId,
          username: data.conversation.friendUsername,
          userstatus: data.userstatus,
          photo: PHOTO_FETCH_URL + data.conversation.friendId,
        }}
      />

      <AddFriendButton member={data} handleClose={() => {}} />
      <BlockUserButton member={data} handleClose={() => {}} />
    </List>
  );
}

interface ButtonParamProps {
  member: any;
  handleClose: any;
}

const AddFriendButton = ({ member, handleClose }: ButtonParamProps) => {
  const sendFriendRequest = () => {
    axios
      .get(BACKEND_URL + "/user/friend/create/" + member.userId, {
        withCredentials: true,
      })
      .then((res) => {})
      .catch((e) => {
        console.log(e.response.data);
      });
    handleClose();
  };

  return (
    <>
      <PopUpButton name={"Add Friend"} callback={sendFriendRequest} />
    </>
  );
};

const BlockUserButton = ({ member, handleClose }: ButtonParamProps) => {
  const blockUser = () => {
    axios
      .post(
        BACKEND_URL + "/user/friend/block/" + member.userId,
        {},
        { withCredentials: true }
      )
      .then((res) => {})
      .catch((e) => {
        console.log(e.response.data.message);
      });
    handleClose();
  };

  return <PopUpButton name={"Block"} callback={blockUser} />;
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

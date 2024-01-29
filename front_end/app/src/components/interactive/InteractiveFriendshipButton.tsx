import React from "react";

import { AxiosError } from "axios";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";

import userService from "src/services/user";

interface friendshipDto {
  receiverId: number;
  isFriend: boolean;
  removeFriend: () => void;
}

function InteractiveFriendshipButton({
  receiverId,
  isFriend,
  removeFriend,
}: friendshipDto) {
  const errorContext = useErrorContext();

  const sendFriendRequest = () => {
    userService
      .sendFriendRequest(receiverId)
      .then(() => {})
      .catch((e: Error | AxiosError) => {
        errorContext.newError?.(errorHandler(e));
      });
  };

  const removeFriendCall = () => {
    userService
      .removeFriend(receiverId)
      .then(() => {
        removeFriend();
      })
      .catch((e: Error | AxiosError) => {
        errorContext.newError?.(errorHandler(e));
      });
  };

  if (isFriend === false) {
    return (
      <button className="btn btn-light" onClick={sendFriendRequest}>
        add friend
      </button>
    );
  } else {
    return (
      <button className="btn btn-light" onClick={removeFriendCall}>
        remove friend
      </button>
    );
  }
}

export default InteractiveFriendshipButton;

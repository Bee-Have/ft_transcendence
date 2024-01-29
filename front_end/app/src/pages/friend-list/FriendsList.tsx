import { BACKEND_URL, PHOTO_FETCH_URL } from "../global/env";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "../../components/menu";
import { Friend, UserStatusEventDto } from "../global/friend.dto";
import { userId } from "../global/userId";

import { useSessionContext } from "src/context/SessionContext";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import { useEffectOnce } from "src/components/useEffectOnce";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

interface CardProps {
  user: Friend;
}

function Card({ user }: CardProps) {
  return (
    <div className="card">
      <div className="PP">
        <InteractiveAvatar user={user} />
      </div>
      <div className="name">
        <InteractiveUsername user={user} />
        <h1>{user.userstatus}</h1>
      </div>
    </div>
  );
}

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();
  const errorContext = useErrorContext();

  const session = useSessionContext();

  useEffectOnce(() => {
    axios
      .get(BACKEND_URL + "/user/friends", {
        withCredentials: true,
      })
      .then((res: any) =>
        setFriends(
          res.data.map((friend: Friend) => {
            if (friend.id === userId) return null;

            friend.photo = PHOTO_FETCH_URL + friend.id;
            return friend;
          })
        )
      )
      .catch((error: Error | AxiosError<unknown, any>) =>
        errorContext.newError?.(errorHandler(error))
      );
  });

  useEffect(() => {
    const listenNewStatus = (eventProps: UserStatusEventDto) => {
      const updatedFriends = friends.map((friend: Friend) =>
        friend.id === eventProps.userId
          ? { ...friend, userstatus: eventProps.userstatus }
          : friend
      );
      setFriends(updatedFriends);
    };

    session.socket?.on("user-status", listenNewStatus);

    return () => {
      session.socket?.off("user-status", listenNewStatus);
    };
  }, [session.socket, friends]);

  return (
    <div className="friendList">
      <div className="header">
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(friends).map((i) => (
            <Card key={i} user={friends[parseInt(i)]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;

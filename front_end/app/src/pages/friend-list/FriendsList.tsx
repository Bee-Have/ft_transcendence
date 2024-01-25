import { BACKEND_URL, PHOTO_FETCH_URL } from '../global/env';

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "../../components/menu";
import { Friend, UserStatusEventDto } from "../global/friend.dto";
import { userId } from "../global/userId";

import { useSessionContext } from "src/context/SessionContext";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

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

  const session = useSessionContext();

  useEffect(() => {
    axios
      .get(BACKEND_URL + '/user/friends', {
        withCredentials: true,
      })
      .then((res) =>
        setFriends(
          res.data.map((friend: Friend) => {
            if (friend.id === userId) return null;

            friend.photo = PHOTO_FETCH_URL + friend.id;
            return friend;
          })
        )
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const listenNewStatus = (eventProps: UserStatusEventDto) => {
      const updatedFriends = friends.map((friend) =>
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
  }, [friends]);

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
            <Card key={i} user={friends[i]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;

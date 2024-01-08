import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Menu from "../../components/menu";
import { Friend } from "../global/friend.dto";
import { userId } from "../global/userId";
import { socket } from "../global/websocket";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

const PHOTO_FETCH_URL = "http://localhost:3001/user/image/";

interface CardProps {
  user: Friend;
}

function Card({ user /*, onClick*/ }: CardProps) {
  return (
    <div className="card">
      <div className="PP">
        <InteractiveAvatar user={user} />
      </div>
      <div className="name">
        <h1>
          <InteractiveUsername user={user} />
          {user.status}
        </h1>
      </div>
    </div>
  );
}

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/user/test/friend/" + userId, {
        withCredentials: true,
      })
      .then((res) =>
        setFriends({ ...res.data, photo: PHOTO_FETCH_URL + res.data.id })
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const listenNewStatus = (status: any) => {
      const updatedFriends = friends.map((friend) =>
        friend.id === status.userId
          ? { ...friend, status: status.status }
          : friend
      );
      setFriends(updatedFriends);
    };

    socket?.on("user-status", listenNewStatus);

    return () => {
      socket?.off("user-status", listenNewStatus);
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

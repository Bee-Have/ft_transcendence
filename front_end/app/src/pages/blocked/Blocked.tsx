import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { userId } from "../global/userId";
import axios from "axios";
//import test from '../asset/default.jpg'

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import Menu from "../../components/menu";
import { BACKEND_URL, PHOTO_FETCH_URL } from '../global/env';

import { Friend } from "src/pages/global/friend.dto";

interface CardProps {
  user: Friend;
}

const Card = ({ user }: CardProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleUnblock = () => {
    axios
      .post(BACKEND_URL + '/user/friend/unblock/' + user.id,
        {},
        { withCredentials: true })
      .then(() => setMessage("Unblocked"))
      .catch((e) => console.log(e));
  };

  return (
    <div className="card">
      <div className="PP">
        <InteractiveAvatar user={user} />
      </div>
      <div className="name">
        <InteractiveUsername user={user} />
      </div>
      <div className="align-right">
        {message ? (
          message
        ) : (
          <Button
            variant="contained"
            className="unblockBtn"
            onClick={handleUnblock}
          >
            Unblock
          </Button>
        )}
      </div>
    </div>
  );
};


const Blocked: React.FC = () => {
  const [blockedUser, setBlockedUser] = useState<Friend[]>([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + '/user/blocked', {
        withCredentials: true,
      })
      .then((res) =>
        setBlockedUser(
          res.data.map((friend: Friend) => {
            if (friend.id === userId) return null;

            friend.photo = PHOTO_FETCH_URL + friend.id;
            return friend;
          })
        )
      )
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="blocked">
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(blockedUser).map((i) => (
            <Card key={i} user={blockedUser[i]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blocked;

import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { userId } from "../global/userId";
import axios from "axios";
//import test from '../asset/default.jpg'

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import Menu from "../../components/menu";
import { BACKEND_URL, PHOTO_FETCH_URL } from "../global/env";

import { Friend } from "src/pages/global/friend.dto";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";
interface CardProps {
  user: Friend;
}

const Card = ({ user }: CardProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const errorContext = useErrorContext();

  const handleUnblock = () => {
    axios
      .post(
        BACKEND_URL + "/user/friend/unblock/" + user.id,
        {},
        { withCredentials: true }
      )
      .then(() => setMessage("Unblocked"))
      .catch((error: Error | AxiosError<unknown, any>) =>
        errorContext.newError?.(errorHandler(error))
      );
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
  const errorContext = useErrorContext();

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/user/blocked", {
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
      .catch((error: Error | AxiosError<unknown, any>) =>
        errorContext.newError?.(errorHandler(error))
      );
  }, [errorContext]);

  return (
    <div className="blocked">
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(blockedUser).map((i) => (
            <Card key={i} user={blockedUser[parseInt(i)]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blocked;

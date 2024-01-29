import React, { useState } from "react";

import axios from "axios";
import { BACKEND_URL, PHOTO_FETCH_URL } from "../global/env";

import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockIcon from "@mui/icons-material/Lock";

// import { UserStatus, Friend } from "../global/friend.dto";
import { Friend } from "../global/friend.dto";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import Menu from "../../components/menu";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

import { useEffectOnce } from "src/components/useEffectOnce";

interface CardProps {
  user: Friend;
}

const Card = ({ user }: CardProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [hideBlock, setHideBlock] = useState(false);
  const errorContext = useErrorContext();

  const handleAcceptFrRq = () => {
    axios
      .post(
        BACKEND_URL + "/user/friend/accept/" + user.id,
        {},
        { withCredentials: true }
      )
      .then(() => setMessage("accepted"))
      .catch((error: Error | AxiosError<unknown, any>) =>
        errorContext.newError?.(errorHandler(error))
      );
  };

  const handleReject = () => {
    axios
      .post(
        BACKEND_URL + "/user/friend/reject/" + user.id,
        {},
        { withCredentials: true }
      )
      .then(() => setMessage("rejected"))
      .catch((error: Error | AxiosError<unknown, any>) =>
        errorContext.newError?.(errorHandler(error))
      );
  };

  const handleBlock = () => {
    axios
      .post(
        BACKEND_URL + "/user/friend/block/" + user.id,
        {},
        { withCredentials: true }
      )
      .then(() => setHideBlock(true))
      .catch((error: Error | AxiosError<unknown, any>) => {
        errorContext.newError?.(errorHandler(error));
        setHideBlock(true);
      });
  };

  return (
    <div className="card">
      <div className="PP">
        <InteractiveAvatar user={user} />
      </div>
      <div className="name">
        <InteractiveUsername user={user} />
      </div>

      {message ? (
        <p color="red">{message}</p>
      ) : (
        <>
          <button className="round-button" onClick={handleAcceptFrRq}>
            <CheckCircleOutlineIcon
              className="acceptBtn"
              style={{ fontSize: "2em" }}
            />
          </button>
          <button className="round-button">
            <BlockIcon
              className="refuseBtn"
              style={{ fontSize: "2em" }}
              onClick={handleReject}
            />
          </button>
          {hideBlock ? (
            ""
          ) : (
            <button className="round-button">
              <LockIcon
                className="blockBtn"
                style={{ fontSize: "2em" }}
                onClick={handleBlock}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const Pending: React.FC = () => {
  const [friendsReq, setFriendsReq] = useState<Friend[]>([]);
  const errorContext = useErrorContext();

  useEffectOnce(() => {
    axios
      .get(BACKEND_URL + "/user/pending/", {
        withCredentials: true,
      })
      .then((res: any) =>
        setFriendsReq(
          res.data.map((friend: Friend) => {
            friend.photo = PHOTO_FETCH_URL + friend.id;
            return friend;
          })
        )
      )
      .catch((error: Error | AxiosError<unknown, any>) => {
        errorContext.newError?.(errorHandler(error));
      });
  });

  return (
    <div className="pending">
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(friendsReq).map((i) => (
            <Card key={i} user={friendsReq[parseInt(i)]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pending;

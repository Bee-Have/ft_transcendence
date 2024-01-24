import React, { useEffect, useState } from "react";

import axios from "axios";
import { BACKEND_URL, PHOTO_FETCH_URL } from '../global/env';

import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockIcon from "@mui/icons-material/Lock";

// import { UserStatus, Friend } from "../global/friend.dto";
import { Friend } from "../global/friend.dto";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import Menu from "../../components/menu";

interface CardProps {
  user: Friend;
}

const Card = ({ user }: CardProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [hideBlock, setHideBlock] = useState(false);

  const handleAcceptFrRq = () => {
    axios
      .post(
        BACKEND_URL + '/user/friend/accept/' + user.id, 
		{}, 
		{ withCredentials: true })
      .then(() => setMessage("accepted"))
      .catch((e) => console.log(e));
  };

  const handleReject = () => {
    axios
      .post(
		BACKEND_URL + "/user/friend/reject/" + user.id, 
		{}, 
		{ withCredentials: true })
      .then(() => setMessage("rejected"))
      .catch((e) => console.log(e));
  };

  const handleBlock = () => {
    axios
      .post(BACKEND_URL + "/user/friend/block/" +  user.id, 
	  	{}, 
	  	{ withCredentials: true })
      .then(() => setHideBlock(true))
      .catch((e) => {
        console.log(e);
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
          <a className="round-button" onClick={handleAcceptFrRq}>
            <CheckCircleOutlineIcon
              className="acceptBtn"
              style={{ fontSize: "2em" }}
            />
          </a>
          <a className="round-button">
            <BlockIcon
              className="refuseBtn"
              style={{ fontSize: "2em" }}
              onClick={handleReject}
            />
          </a>
          {hideBlock ? (
            ""
          ) : (
            <a className="round-button">
              <LockIcon
                className="blockBtn"
                style={{ fontSize: "2em" }}
                onClick={handleBlock}
              />
            </a>
          )}
        </>
      )}
    </div>
  );
};

const Pending: React.FC = () => {
  const [friendsReq, setFriendsReq] = useState<Friend[]>([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/user/pending/", {
        withCredentials: true,
      })
      .then((res) =>
        setFriendsReq(
          res.data.map((friend: Friend) => {
            friend.photo = PHOTO_FETCH_URL + friend.id;
            return friend;
          })
        )
      )
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="pending">
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(friendsReq).map((i) => (
            <Card key={i} user={friendsReq[i]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pending;

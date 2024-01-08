import axios from 'axios';
import React, { useEffect, useState } from "react";
// import PopUp from "../../components/popUp";
import Menu from "../../components/menu";
import { Friend } from "../global/friend.dto";
import { userId } from '../global/userId';
import { socket } from "../global/websocket";

// import { Avatar } from "@mui/material";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

const PHOTO_FETCH_URL = "http://localhost:3001/user/image/";

interface CardProps {
  user: Friend;
  //   onClick: (user: Friend, event: React.MouseEvent<HTMLDivElement>) => void;
}

function Card({ user /*, onClick*/ }: CardProps) {
  return (
    <div className="card">
      <div className="PP">
        {/* <img src={photo} alt={'test'} className="person-image" /> */}
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
  //   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //   const [popupContent, setPopupContent] = useState<Friend>({
  //     id: 0,
  //     username: "",
  //     status: "",
  // 	photo: PHOTO_FETCH_URL + 0
  //   });

  // const [showPopUp, setPopUp] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [friends, setFriends] = useState<Friend[]>([]);

  //   const handleCardClick = (
  //     user: Friend,
  //     event: React.MouseEvent<HTMLDivElement>
  //   ) => {
  //     setPopupContent(user);
  //     setAnchorEl(event.currentTarget);
  //     // const boundingBox = event.currentTarget.getBoundingClientRect();
  //     // if (boundingBox) {
  //     // 	const x = event.pageX;
  //     // 	const y = event.pageY;

  //     // 	setMousePosition({ x, y });
  //     // 	setPopupContent(name);
  //     // 	setPopUp(true);
  //     // }
  //   };

  useEffect(() => {
    axios.get('http://localhost:3001/user/test/friend/' + userId, { withCredentials: true })
    .then(res => setFriends({ ...res.data, photo: PHOTO_FETCH_URL + res.data.id}))
    .catch(err => console.log(err))
    // setFriends([
    //   { id: 1, username: "t", status: "online", photo: PHOTO_FETCH_URL + 1 },
    //   {
    //     id: 2,
    //     username: "123456789",
    //     status: "offline",
    //     photo: PHOTO_FETCH_URL + 2,
    //   },
    //   {
    //     id: 3,
    //     username: "123456789abcdef",
    //     status: "online",
    //     photo: PHOTO_FETCH_URL + 3,
    //   },
    //   {
    //     id: 4,
    //     username: "pasteque",
    //     status: "offline",
    //     photo: PHOTO_FETCH_URL + 4,
    //   },
    //   {
    //     id: 5,
    //     username: "test5",
    //     status: "playing",
    //     photo: PHOTO_FETCH_URL + 5,
    //   },
    // ]);
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
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(friends).map((i) => (
            <Card
              key={i}
              user={friends[i]}
              //   onClick={handleCardClick}
            />
          ))}
        </div>
      </div>
      {/* {
        <PopUp
          user={popupContent}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      } */}
    </div>
  );
};

export default FriendList;

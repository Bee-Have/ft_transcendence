import React, { useState } from "react";
import PopUp from "../../components/popUp";

import Menu from "../../components/menu";

import { Friend } from "../global/friend.dto";

import { Avatar, Box } from "@mui/material";

const PHOTO_FETCH_URL = "http://localhost:3001/user/image/";

interface CardProps {
  winner: string;
  user: Friend;
  mode: string;
  onClick: (user: Friend, event: React.MouseEvent<HTMLDivElement>) => void;
}

const Match: React.FC<CardProps> = ({ winner, user, mode, onClick }) => {
  return (
    <div className="match" onClick={(event) => onClick(user, event)}>
      <div className={winner}>
        <h1>{winner}</h1>
      </div>
      <div className="VS">
        <h1>VS</h1>
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Avatar sx={{ width: 60, height: 60 }} src={user.photo} />
        {/* <img src={user.photo} alt={"test"} className="person-image" /> */}
        <h1>{user.username}</h1>
      </Box>
      <div className="score">
        <h1>score</h1>
      </div>
      <div className="mode">
        <h1>{mode}</h1>
      </div>
    </div>
  );
};

const MatchHistory: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popupContent, setPopupContent] = useState<Friend>({
    id: 0,
    username: "",
    status: "",
    photo: PHOTO_FETCH_URL + 0,
  });

  // const [showPopUp, setPopUp] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleCardClick = (
    user: Friend,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setPopupContent(user);
    setAnchorEl(event.currentTarget);
    // const boundingBox = event.currentTarget.getBoundingClientRect();
    // if (boundingBox) {
    // 	const x = event.pageX;
    // 	const y = event.pageY;

    // 	setMousePosition({ x, y });
    // 	setPopupContent(name);
    // 	setPopUp(true);
    // }
  };

  return (
    <div className="matchHistory">
      <Menu />
      <div className="content">
        <div className="printCard">
          <Match
            winner="tie"
            user={{
              id: 1,
              username: "test1",
              status: "online",
              photo: PHOTO_FETCH_URL + 1,
            }}
            mode="infinity"
            onClick={handleCardClick}
          />
          <div className="separator"></div>
          <Match
            winner="victory"
            user={{
              id: 2,
              username: "test2",
              status: "online",
              photo: PHOTO_FETCH_URL + 2,
            }}
            mode="infinity"
            onClick={handleCardClick}
          />
          <div className="separator"></div>
          <Match
            winner="defeat"
            user={{
              id: 3,
              username: "test3",
              status: "offline",
              photo: PHOTO_FETCH_URL + 3,
            }}
            mode="infinity"
            onClick={handleCardClick}
          />
          <div className="separator"></div>
          <Match
            winner="victory"
            user={{
              id: 4,
              username: "test4",
              status: "playing",
              photo: PHOTO_FETCH_URL + 4,
            }}
            mode="infinity"
            onClick={handleCardClick}
          />
        </div>
      </div>
      {
        <PopUp
          user={popupContent}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      }
      {/* {showPopUp && <PopUp x={mousePosition.x} y={mousePosition.y} user={popupContent}/>} */}
    </div>
  );
};

export default MatchHistory;

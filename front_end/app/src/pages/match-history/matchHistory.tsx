import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "../../components/menu";

import { Friend, UserStatus } from "../global/friend.dto";

import { Box } from "@mui/material";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

const PHOTO_FETCH_URL = "http://localhost:3001/user/image/";

interface CardProps {
  outcome: string;
  user: Friend;
  score: string;
  mode: string;
}

const Match: React.FC<CardProps> = ({ outcome, user, score, mode }) => {
  return (
    <div className="match">
      <div className={outcome}>
        <h1>{outcome}</h1>
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
        <InteractiveAvatar user={user} />
        <InteractiveUsername user={user} />
      </Box>
      <div className="score">
        <h1>{score}</h1>
      </div>
      <div className="mode">
        <h1>{mode}</h1>
      </div>
    </div>
  );
};

interface MatchHistoryProps {
  outcome: string;
  user: Friend;
  score: string;
  mode: string;
}

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<MatchHistoryProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Call to get the history of the user
    // axios
    //   .get("http://localhost:3001/user/test/match-history/" + userId, {
    // 	withCredentials: true,
    //   })
    //   .then((res) =>
    // 	setMatches({ ...res.data, photo: PHOTO_FETCH_URL + res.data.id })
    //   )
    //   .catch((err) => console.log(err));
    setMatches([
      {
        user: {
          id: 1,
          username: "test1",
          status: UserStatus.online,
          photo: PHOTO_FETCH_URL + 1,
        },
        mode: "speed",
        score: "5 / 3",
        outcome: "victory",
      },
      {
        user: {
          id: 2,
          username: "test2",
          status: UserStatus.online,
          photo: PHOTO_FETCH_URL + 2,
        },
        mode: "retro",
        score: "3 / 11",
        outcome: "defeat",
      },
      {
        user: {
          id: 3,
          username: "test3",
          status: UserStatus.offline,
          photo: PHOTO_FETCH_URL + 3,
        },
        mode: "time",
        score: "2 / 2",
        outcome: "tie",
      },
      {
        user: {
          id: 4,
          username: "test4",
          status: UserStatus.ingame,
          photo: PHOTO_FETCH_URL + 4,
        },
        mode: "classic",
        score: "10 / 1",
        outcome: "victory",
      },
    ]);
  }, []);

  return (
    <div className="matchHistory">
      <div className="header">
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <Menu />
      <div className="content">
        <div className="printCard">
          {Object.keys(matches).map((i) => (
            <Match
              key={i}
              outcome={matches[i].outcome}
              user={matches[i].user}
              score={matches[i].score}
              mode={matches[i].mode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "../../components/menu";

import { Friend } from "../global/friend.dto";

import { Box } from "@mui/material";

import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";

import { useEffectOnce } from "src/components/useEffectOnce";

import gameService from "src/services/game";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

import { userId } from "src/pages/global/userId";

interface CardProps {
  outcome: string;
  user: Friend;
  score: string;
  mode: string;
}

function Match({ match }: { match: CardProps }) {
  const { outcome, user, score, mode } = match;
  return (
    <div className="match">
      <div className={outcome}>
        <h1>{outcome}</h1>
      </div>
      <h1>VS</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <InteractiveAvatar user={user} usage={"stranger"} />
        <InteractiveUsername user={user} usage={"stranger"} />
      </Box>
      <div className="score">
        {score}
      </div>
      <div>
        {mode}
      </div>
    </div>
  );
}

interface MatchHistoryItemDto {
  winnerId: number | null;
  p1: Friend;
  p1Score: string;
  p2: Friend;
  p2Score: string;
  gameMode: string;
}

interface MatchHistoryProps {
  outcome: string;
  user: Friend;
  score: string;
  mode: string;
}

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<MatchHistoryProps[]>([]);
  const navigate = useNavigate();
  const errorContext = useErrorContext();

  useEffectOnce(() => {
    gameService
      .getMatchHistory(userId)
      .then((res) => {
        setMatches(
          res.map((match: MatchHistoryItemDto) => {
            let matchResult: MatchHistoryProps = {} as MatchHistoryProps;

            if (match.winnerId === null) {
              matchResult.outcome = "draw";
            } else if (match.winnerId === userId) {
              matchResult.outcome = "victory";
            } else {
              matchResult.outcome = "defeat";
            }
            //check with profile owner Id rather then your userId when merge complete
            matchResult.user = match.p1.id === userId ? match.p2 : match.p1;
            matchResult.score =
              match.p1.id === userId
                ? `${match.p1Score}/${match.p2Score}`
                : `${match.p2Score}/${match.p1Score}`;
            matchResult.mode = match.gameMode;
            return matchResult;
          })
        );
      })
      .catch((error: Error | AxiosError<unknown, any>) => {
        errorContext.newError?.(errorHandler(error));
      });
  });

  return (
    <div className="matchHistory">
      <div className="content">
        <div className="printCard">
          {Object.keys(matches).map((i) => (
            <Match key={i} match={matches[i]} />
          ))}
        </div>
      </div>
      <div className="header">
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <Menu />
    </div>
  );
};

export default MatchHistory;

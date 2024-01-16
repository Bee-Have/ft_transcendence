import React from "react";

import { useNavigate } from "react-router-dom";
import { getQueryVariable } from "src/pages/game/getQueryVariable";
import { useEffectOnce } from "src/components/useEffectOnce";

import gameService from "src/services/game";

import "src/css/RedirectGame.css";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { AxiosError } from "axios";

interface RunningGameDto {
  player1Id: number;
  player2Id: number;

  gameMode: string;
}

function RedirectGame() {
  const navigate = useNavigate();
  const errorContext = useErrorContext();

  const player1Id: string = getQueryVariable("player1") ?? "0";
  const player2Id: string = getQueryVariable("player2") ?? "0";
  const gameMode: string = getQueryVariable("gameMode") ?? "0";

  let gameUrl: string = "/game/";

  useEffectOnce(() => {
    if (player1Id !== "0" && player2Id === "0" && gameMode === "0") {
      gameService
        .getUserCurrentGame(parseInt(player1Id))
        .then((response: RunningGameDto) => {
          gameUrl += response.gameMode + "?player1=" + player1Id + "&player2=";
          gameUrl +=
            response.player2Id === parseInt(player1Id)
              ? response.player1Id
              : response.player2Id;
          navigate(gameUrl);
        })
        .catch((error: Error | AxiosError<unknown, any>) => {
          errorContext.newError?.(errorHandler(error));
		  navigate("/");
        });
    } else if (player1Id === "0" || player2Id === "0" || gameMode === "0") {
      navigate("/");
    } else {
      gameUrl += gameMode + "?player1=" + player1Id + "&player2=" + player2Id;
      navigate(gameUrl);
    }
  });

  return (
    <div className="RedirectGame">
      <header className="RedirectText"> Redirecting to game page .... </header>
    </div>
  );
}

export default RedirectGame;

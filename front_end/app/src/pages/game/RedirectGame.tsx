import React from "react";

import { useNavigate } from "react-router-dom";
import { getQueryVariable } from "src/pages/game/getQueryVariable";
import { useEffectOnce } from "src/components/useEffectOnce";

import "src/css/RedirectGame.css";

function RedirectGame() {
  const navigate = useNavigate();
  const player1Id: string = getQueryVariable("player1") ?? "0";
  const player2Id: string = getQueryVariable("player2") ?? "0";
  const gameMode: string = getQueryVariable("gameMode") ?? "0";

  useEffectOnce(() => {
    if (player1Id === "0" || player2Id === "0" || gameMode === "0") {
      return navigate("/");
    }

    const gameUrl =
      "/game/" + gameMode + "?player1=" + player1Id + "&player2=" + player2Id;
    navigate(gameUrl);
  });

  return (
    <div className="RedirectGame">
      <header className="RedirectText"> Redirecting to game page .... </header>
    </div>
  );
}

export default RedirectGame;

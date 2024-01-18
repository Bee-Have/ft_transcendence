import React from "react";
import "src/pages/game/solo/Game.css";
import "src/pages/game/solo/Retro.css";

function DynamicBackground({ gameMode }: { gameMode: string }) {
  return (
    <>
      {gameMode !== "retro" && (
        <div className="Pong-game-left-bg" id="Pong-game-left-bg" />
      )}
      {gameMode !== "retro" && (
        <div className="Pong-game-right-bg" id="Pong-game-right-bg" />
      )}
      {gameMode === "retro" && (
        <div className="Pong-game-retro-hidden-bg" id="hidden-bg-retro" />
      )}
    </>
  );
}

export default DynamicBackground;

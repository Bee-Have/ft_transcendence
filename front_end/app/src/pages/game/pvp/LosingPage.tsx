import React from "react";

import GameOverComponent from "src/components/game/GameOverComponent";

import { useEffectOnce } from "src/components/useEffectOnce";

import { pvpGameOverAnimation } from "src/components/game/animations/gameOverAnimation";

import "../solo/Game.css";

function LosingPage() {
  const [isAnimationOver, setIsAnimationOver] = React.useState(false);

  useEffectOnce(() => {
    setTimeout(() => {
      pvpGameOverAnimation("opponent");
      setTimeout(() => {
        setIsAnimationOver(true);
      }, 1300);
    }, 200);
  });

  if (isAnimationOver === false) {
    return (
      <div className="Pong-game">
        <div className="Pong-game-left-bg" id="Pong-game-left-bg" />
        <div className="Pong-game-right-bg" id="Pong-game-right-bg" />
      </div>
    );
  }

  return (
    <GameOverComponent winner={"opponent"} playerScore={0} opponentScore={1} />
  );
}

export default LosingPage;

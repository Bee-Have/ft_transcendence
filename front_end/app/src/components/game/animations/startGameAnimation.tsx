import React from "react";

import Styles from "./startGameAnimation.module.css";

import { CountdownCircleTimer } from "react-countdown-circle-timer";


function StartGameAnimation() {
  const [done, setDone] = React.useState(false);

  if (done === true) return null;
  return (
    <div className={Styles.Container}>
      <CountdownCircleTimer
        isPlaying
        duration={3}
        colors={["#004777", "#004777", "#004777"]}
        colorsTime={[3, 2, 0]}
        onComplete={() => setDone(true)}
		size={70}
		rotation="counterclockwise"
		strokeLinecap="square"
		trailColor="#abc"
      />
    </div>
  );
}

export default StartGameAnimation;

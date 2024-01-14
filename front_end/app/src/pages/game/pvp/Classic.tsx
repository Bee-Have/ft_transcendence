import React from "react";
import { getQueryVariable } from "../getQueryVariable";


function ClassicGamePvp() {
  const playerOne = getQueryVariable("player1");
  const playerTwo = getQueryVariable("player2");

  return (
	<div>
	  <h1>Player 1: {playerOne}</h1>
	  <h1>Player 2: {playerTwo}</h1>
	</div>
  );
}

export default ClassicGamePvp;
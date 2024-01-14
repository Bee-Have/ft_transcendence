import React from "react";
import { getQueryVariable } from "../getQueryVariable";
import { io, Socket } from "socket.io-client";


function ClassicGamePvp() {
  const playerOne = getQueryVariable("player1");
  const playerTwo = getQueryVariable("player2");

  const gameSocket = React.useRef<Socket>();

  React.useEffect(() => {
	if (gameSocket.current === undefined) {
	  gameSocket.current = io("http://localhost:3001/game", { transports: ["websocket"] });
	}
  }, []);

  return (
	<div>
	  <h1>Player 1: {playerOne}</h1>
	  <h1>Player 2: {playerTwo}</h1>
	</div>
  );
}

export default ClassicGamePvp;
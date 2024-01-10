import React from 'react';
import './RetroScore.css'

// should be named "ScoreDisplay" since it just displays the score
const Score = ({player, opponent} : {player : number, opponent : number}) => {
    return (
      <div className="RetroScore">
        <div id="player-score">{player}</div>
        <div id="opponent-score">{opponent}</div>
      </div>
    );
};

export default Score;
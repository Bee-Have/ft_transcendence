import React from 'react';
import './Score.css'

// should be named "ScoreDisplay" since it just displays the score
const Score = ({player, opponent} : {player : number, opponent : number}) => {
    return (
      <div className="Score">
        <div className="Player" id="player-score">{player}</div>
        <div className="Opponent" id="opponent-score">{opponent}</div>
      </div>
    );
};

export default Score;
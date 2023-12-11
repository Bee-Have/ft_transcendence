import React from 'react';

interface CardProps {
  winner: string;
  photo: string;
  text: string;
  mode: string;
}

const Match: React.FC<CardProps> = ({winner, photo, text, mode}) => {
  return (
    <div className="match">
      <div className={winner}>
        <h1>{winner}</h1>
      </div>
      <div className="VS">
        <h1>VS</h1>
      </div>
      <div className="PP">
        <img src={require(photo)} alt={'test'} className="person-image"/>
      </div>
      <div className="opposantName">
        <h1>{text}</h1>
      </div>
      <div className="score">
        <h1>{text}</h1>
      </div>
      <div className="mode">
        <h1>{text}</h1>
      </div>
    </div>
  );
};

const MatchHistory: React.FC = () => {
  return (
    <div className="matchHistory">
      <div className="content">
        <div className="printCard">
          <Match winner='tie' photo={'../asset/default.jpg'} text={'test1'} mode={'infinity'}/>
          <div className="separator"></div>
          <Match winner='victory' photo={'../asset/default.jpg'} text={'test2'} mode={'infinity'}/>
          <div className="separator"></div>
          <Match winner='defeat' photo={'../asset/default.jpg'} text={'test3'} mode={'infinity'}/>
          <div className="separator"></div>
          <Match winner='victory' photo={'../asset/default.jpg'} text={'test4'} mode={'infinity'}/>
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;
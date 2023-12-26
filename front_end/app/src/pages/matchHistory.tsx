import React, {useState} from 'react';
import PopUp from '../components/popUp';

import Menu from '../components/menu';

interface CardProps {
  winner: string;
  photo: string;
  text: string;
  mode: string;
  onClick: (name: string, event: React.MouseEvent<HTMLDivElement>) => void;
}

const Match: React.FC<CardProps> = ({winner, photo, text, mode, onClick}) => {
  return (
    <div className="match" onClick={(event) => onClick(text, event)}>
      <div className={winner}>
        <h1>{winner}</h1>
      </div>
      <div className="VS">
        <h1>VS</h1>
      </div>
      <div className="PP">
        <img src={photo} alt={'test'} className="person-image"/>
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
  const [showPopUp, setPopUp] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popupContent, setPopupContent] = useState('');

  const handleCardClick = (name: string, event: React.MouseEvent<HTMLDivElement>) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    if (boundingBox) {
      const x = event.pageX;
      const y = event.pageY;

      setMousePosition({ x, y });
      setPopupContent(name);
      setPopUp(true);
    }
  };


  return (
    <div className="matchHistory">
      <Menu/>
      <div className="content">
        <div className="printCard">
          <Match winner='tie' photo={require('../asset/default.jpg')} text={'test1'} mode={'infinity'} onClick={handleCardClick}/>
          <div className="separator"></div>
          <Match winner='victory' photo={require('../asset/default.jpg')} text={'test2'} mode={'infinity'} onClick={handleCardClick}/>
          <div className="separator"></div>
          <Match winner='defeat' photo={require('../asset/default.jpg')} text={'test3'} mode={'infinity'} onClick={handleCardClick}/>
          <div className="separator"></div>
          <Match winner='victory' photo={require('../asset/default.jpg')} text={'test4'} mode={'infinity'} onClick={handleCardClick}/>
        </div>
      </div>
      {showPopUp && <PopUp x={mousePosition.x} y={mousePosition.y} user={popupContent}/>}
    </div>
  );
};

export default MatchHistory;
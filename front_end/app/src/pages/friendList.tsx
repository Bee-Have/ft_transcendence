import React, { useState } from 'react';
import PopUp from '../components/popUp';

interface CardProps {
  photo: string;
  name: string;
  onClick: (name: string, event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ photo, name, onClick }) => {
  return (
    <div className="card" onClick={(event) => onClick(name, event)}>
      <div className="PP">
        <img src={require('../asset/default.jpg')} alt={'test'} className="person-image" />
      </div>
      <div className='name'>
        <h1>{name}</h1>
      </div>
    </div>
  );
};

const FriendList: React.FC = () => {
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
    <div className="friendList">
      <div className="content">
        <div className="printCard">
          <Card photo={'./asset/default.jpg'} name={'test1'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test2'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test3'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test4'} onClick={handleCardClick}/>
        </div>
      </div>
      {showPopUp && <PopUp x={mousePosition.x} y={mousePosition.y} user={popupContent}/>}
    </div>
  );
};

export default FriendList;
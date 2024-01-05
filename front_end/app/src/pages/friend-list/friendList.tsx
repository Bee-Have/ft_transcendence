import React, { useState } from 'react';
import PopUp from '../../components/popUp';

import Menu from '../../components/menu';

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
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [popupContent, setPopupContent] = useState('');

  // const [showPopUp, setPopUp] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  const handleCardClick = (name: string, event: React.MouseEvent<HTMLDivElement>) => {
		setPopupContent(name);
		setAnchorEl(event.currentTarget);
		// const boundingBox = event.currentTarget.getBoundingClientRect();
		// if (boundingBox) {
		// 	const x = event.pageX;
		// 	const y = event.pageY;

		// 	setMousePosition({ x, y });
		// 	setPopupContent(name);
		// 	setPopUp(true);
		// }
  };

  return (
    <div className="friendList">
      <Menu/>
      <div className="content">
        <div className="printCard">
          <Card photo={'./asset/default.jpg'} name={'test1'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test2'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test3'} onClick={handleCardClick}/>
          <Card photo={'./asset/default.jpg'} name={'test4'} onClick={handleCardClick}/>
        </div>
      </div>
			{<PopUp
				user={popupContent}
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
			/>}
    </div>
  );
};

export default FriendList;
import React from 'react';

interface PopUpProps {
    x: number;
    y: number;
    user: string;
  }

const PopUp: React.FC<PopUpProps> = ({ x, y, user}) => {
  const squareStyle: React.CSSProperties = {
    position: 'absolute',
		paddingTop: '20px',
    left: `${x}px`,
    top: `${y}px`,
  };
  
  return(
  <div style={squareStyle} className='popUp'>
    <span className="btn d-block p-2">Profile</span>
		<span className="btn d-block p-2">Spectate</span>
    <span className="btn d-block p-2">Message</span>
    <span className="btn d-block p-2">add friend</span>
  </div>
)};

export default PopUp;
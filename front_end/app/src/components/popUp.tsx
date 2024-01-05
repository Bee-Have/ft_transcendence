import React from 'react';

import { useNavigate } from 'react-router-dom';

import InviteSpectateButton from './DynamicInviteSpectateButton';

interface PopUpProps {
    x: number;
    y: number;
    user: string;
  }

const PopUp: React.FC<PopUpProps> = ({ x, y, user}) => {
  const navigate = useNavigate();
  const squareStyle: React.CSSProperties = {
    position: 'absolute',
    paddingTop: '20px',
    left: `${x}px`,
    top: `${y}px`,
  };

  return(
  <div style={squareStyle} className='popUp'>
  {/* make a query string for other users profiles when they are implemented */}
    <span className="btn d-block p-2" onClick={() => navigate("/profil")}>Profil</span>
    <span><InviteSpectateButton /></span>
  {/* link navigate to specific private message */}
    <span className="btn d-block p-2" onClick={() => navigate("/chat")} >Message</span>
    <span className="btn d-block p-2">add friend</span>
  </div>
)};

export default PopUp;
import React from 'react';
import '../css/header.css';

import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isLogged: boolean;
  showChat: boolean;
  showProfil: boolean;
  updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
  logout: () => void;
}

// here see how to delete booleans
const Header: React.FC<HeaderProps> = ({ isLogged, showProfil, showChat, updateBooleanStates, logout}) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      {isLogged && !showProfil && (
        <button className="btn btn-light" onClick={() => navigate("/profil")}>Profile</button>
        // <button className="btn btn-light" onClick={() => updateBooleanStates({showProfil:true,showMenu:true})}>Profile</button>
      )}
      {showChat && (
          <button className="btn btn-light" onClick={() => navigate("/")}>home</button>
        //   <button className="btn btn-light" onClick={() => updateBooleanStates({showWelcome:true})}>home</button>
      )}
      {showProfil && (
        <>
          <button className="btn btn-light">Invite to game</button>
          <button className="btn btn-light">edit profil</button>
          <button className="btn btn-light" onClick={() => navigate("/")}>home</button>
          {/* <button className="btn btn-light" onClick={() => updateBooleanStates({ showWelcome: true})}>home</button> */}
          <button className="btn btn-light" onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Header;
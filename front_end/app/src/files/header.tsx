import React from 'react';
import '../css/header.css';

interface HeaderProps {
  isLogged: boolean;
  showProfil: boolean;
  updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLogged, showProfil, updateBooleanStates, logout}) => {
  return (
    <div className="header">
      {isLogged && !showProfil && (
        <button className="btn btn-light" onClick={() => updateBooleanStates({ showProfil: true, showMenu: true })}>
          Profile
        </button>
      )}
      {showProfil && (
        <>
          <button className="btn btn-light">Invit to game</button>
          <button className="btn btn-light">edit profil</button>
          <button className="btn btn-light" onClick={() => updateBooleanStates({ showWelcome: true})}>home</button>
          <button className="btn btn-light" onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Header;
import React from 'react';
import '../css/welcome.css'

import { useNavigate } from 'react-router-dom';

interface WelcomeProps
{
  isLogged: boolean;
  openLoginWindow: () => void;
  acceptConnection: () => void;
  updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ isLogged, openLoginWindow, acceptConnection, updateBooleanStates}) => {
  const navigate = useNavigate();
  return (
    <div className="log_window">
      <div className="welcome">
        <h1 className="display-1">Welcome</h1>
      </div>
      <div className="login-choice rounded">
        <div className="container row justify-content-center">
          <div className="col-md-4">
            {!isLogged && <button className="btn btn-light" onClick={openLoginWindow}>Login</button>}
            {isLogged && <button className="btn btn-light" onClick={() => navigate("/chat")}>Chat</button>}
            {/* {isLogged && <button className="btn btn-light" onClick={() => updateBooleanStates({showChat:true})}>Chat</button>} */}
          </div>
          <div className="col-md-4">
            {!isLogged && <button className="btn btn-light" onClick={acceptConnection}>Guest</button>}
            {isLogged && <button className="btn btn-light">play</button>}
          </div>
          <div className="col-md-4">
            <button className="btn btn-light">leaderboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

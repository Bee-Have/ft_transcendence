import React from 'react';

interface WelcomeProps {
  isLogged: boolean;
  openLoginWindow: () => void;
  acceptConnection: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ isLogged, openLoginWindow, acceptConnection }) => {
  return (
    <div className="log_window">
      <div className="welcome">
        <h1 className="display-1">Welcome</h1>
      </div>
      <div className="login-choice rounded">
        <div className="container row justify-content-center">
          <div className="col-md-4">
            {!isLogged && <button className="btn btn-light" onClick={openLoginWindow}>Login</button>}
            {isLogged && <button className="btn btn-light">Chat</button>}
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

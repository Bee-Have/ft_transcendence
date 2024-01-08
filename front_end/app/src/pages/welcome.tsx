import React from 'react';
import '../css/welcome.css'
import '../css/header.css'

import { useNavigate } from 'react-router-dom';

// interface WelcomeProps
// {
//   isLogged: boolean;
//   openLoginWindow: () => void;
//   acceptConnection: () => void;
//   updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
// }

// const Welcome: React.FC<WelcomeProps> = ({ isLogged, openLoginWindow, acceptConnection, updateBooleanStates}) => {
const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = React.useState(false);
  const [guest, setGuest] = React.useState(false);

  const authenticateUser = () => {
	setAuthenticated(true);
  }

  const guestUser = () => {
	setGuest(true);
  }

  return (
    <div className="log_window">
		{/* add querry here to check if authentification token was filled */}
		{authenticated &&
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/profil")}>profile</button>
			</div>
		}
        <h1 className="display-1 welcome">welcome</h1>
      <div className="login-choice">
          <div className="col-md-4">
            {!authenticated && <button className="btn btn-light" onClick={authenticateUser}>login</button>}
            {authenticated && <button className="btn btn-light" onClick={() => navigate("/chat")}>chat</button>}
          </div>
          <div className="col-md-4">
            {!authenticated && !guest && <button className="btn btn-light" onClick={guestUser}>guest</button>}
            {(authenticated || guest) && <button className="btn btn-light">play</button>}
          </div>
          <div className="col-md-4">
            <button className="btn btn-light" >leaderboard</button>
            {/* <button className="btn btn-light" onClick={() => navigate("/leaderboard")}>leaderboard</button> */}
          </div>
      </div>
    </div>
  );
};

export default Welcome;

import React, { useEffect } from 'react';
import '../../css/welcome.css'

import PlayGameModeDialogButton from '../../components/game/GameModeDialog/PlayGameModeDialogButton';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReadCookie } from '../../components/ReadCookie';
import isTokenExpired from '../global/isTokenExpired';

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
//   this is a temporary variable until the back is linked to the front
  const [authenticated, setAuthenticated] = React.useState(false);
  const [guest, setGuest] = React.useState(false);
  const aToken = ReadCookie('access_token')
  const rToken = ReadCookie('refresh_token')

	// const login = () => {
  // }
  
  const authenticateUser = () => {
    // this is temporary
    // here call the 42 portal to authenticate the user
    axios.get('http://localhost:3001/auth')
    .then((res: any) => {
      window.location.replace(res.data)
    })
    .catch(e => console.log(e))
	// login()
    // setAuthenticated(true);
  }

  useEffect(() => {
		if (!aToken)
		{
			console.log('login')
			// login()
			setAuthenticated(false)
		}
		else if ( isTokenExpired(aToken) )
		{
			console.log('Atoken Expired')
			if ( !rToken || isTokenExpired(rToken) )
			{
				console.log('No Rt or expired')
				setAuthenticated(false)
			// login()
			}
			else
			{
				console.log('posting')
				axios.post('http://localhost:3001/auth/refresh', {}, { withCredentials:true })
				.then(() => {
					window.location.reload()
				})
				.catch((e) => console.log(e))
			}

		}
		else
			setAuthenticated(true)
  }, [])



  const guestUser = () => {
	setGuest(true);
  }

  return (
    <div className="log_window">
		{/* add querry here to check if authentification token was filled */}
		{authenticated && <button className="btn btn-light profile-btn" onClick={() => navigate("/profil")}>profile</button>}
        <h1 className="display-1 welcome">welcome</h1>
      <div className="login-choice">
          <div className="col-md-4">
            {!authenticated && <button className="btn btn-light" onClick={authenticateUser}>login</button>}
            {authenticated && <button className="btn btn-light" onClick={() => navigate("/chat")}>chat</button>}
            {/* {authenticated && <button className="btn btn-light" onClick={() => updateBooleanStates({showChat:true})}>Chat</button>} */}
          </div>
          <div className="col-md-4">
            {!authenticated && !guest && <button className="btn btn-light" onClick={guestUser}>guest</button>}
            {/* {(authenticated || guest) && <button className="btn btn-light">play</button>} */}
            {(authenticated || guest) && <PlayGameModeDialogButton />}
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

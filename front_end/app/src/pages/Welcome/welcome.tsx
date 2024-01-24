import React, { useEffect } from "react";
import PlayGameModeDialogButton from "../../components/game/GameModeDialog/PlayGameModeDialogButton";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ReadCookie } from '../../components/ReadCookie';
import { BACKEND_URL } from '../global/env';
import isTokenExpired from '../global/isTokenExpired';
        
import "src/css/header.css";
import "src/css/welcome.css";

import TFAConnection from "src/components/2FAConnection";
import { useGamePopup } from "src/context/GamePopupContext";
import { resetUserId, userId } from "../global/userId";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = React.useState(false);
  const [guest, setGuest] = React.useState(false);
  const [print2FA, set2FA] = React.useState(false);
  const aToken = ReadCookie("access_token");
  const rToken = ReadCookie("refresh_token");
  const TFA = ReadCookie("TfaEnable");


  const gamePopup = useGamePopup();

  const authenticateUser = () => {
    axios.get(BACKEND_URL + '/auth')
    .then((res: any) => {
      window.location.replace(res.data)
    })
    .catch(e => console.log(e))
    if (aToken && TFA){
      alert("2FA require here");
    }
  };

  useEffect(() => {
    if (!aToken)
		{
      if (TFA) {
        set2FA(true);
        console.log('2FA');
      }
      else {
        console.log('login');
			  setAuthenticated(false);
      }
		}
		else if ( isTokenExpired(aToken) )
		{
			console.log('Atoken Expired')
			if ( !rToken || isTokenExpired(rToken) )
			{
				console.log('No Rt or expired');
				setAuthenticated(false);
			}
			else
			{
				console.log('posting')
        axios
          .post(
            BACKEND_URL + "/auth/refresh",
            {},
            { withCredentials: true }
          )
          .then(() => {
            window.location.reload();
          })
          .catch((e) => console.log(e));
      }
    } else {
      setAuthenticated(true);
      resetUserId()
    }
  }, [aToken, rToken]);

  const guestUser = () => {
    setGuest(true);
  };

  return (
    <div className="log_window">
		{print2FA && <TFAConnection popUp={set2FA} btn={setAuthenticated}/>}
      {authenticated && (
        <div className="header">
          <button className="btn btn-light" onClick={() => navigate(`/profil/` + userId)}>
            profile
          </button>
        </div>
      )}
      <h1 className="display-1 welcome">welcome</h1>
      <div className="login-choice">
        <div className="col-md-4">
          {!authenticated && (
            <button className="btn btn-light" onClick={authenticateUser}>
              login
            </button>
          )}
          {authenticated && (
            <button className="btn btn-light" onClick={() => navigate("/chat")}>
              chat
            </button>
          )}
        </div>
        <div className="col-md-4">
          {!authenticated && !guest && (
            <button className="btn btn-light" onClick={guestUser}>
              guest
            </button>
          )}
          {(authenticated || guest) && <PlayGameModeDialogButton />}
        </div>
        <div className="col-md-4">
          <button className="btn btn-light" onClick={() => {gamePopup.setIsVisible(!gamePopup.isVisible)}} >leaderboard</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

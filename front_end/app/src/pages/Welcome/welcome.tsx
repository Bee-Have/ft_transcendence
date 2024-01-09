import React, { useEffect } from "react";
import PlayGameModeDialogButton from "../../components/game/GameModeDialog/PlayGameModeDialogButton";

import "src/css/welcome.css";
import "src/css/header.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReadCookie } from "../../components/ReadCookie";
import isTokenExpired from "../global/isTokenExpired";

import { useGamePopup } from "src/context/GamePopupContext";

import MatchmakingPopup from "src/components/game/GamePopup/MatchmakingPopup";

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
  const aToken = ReadCookie("access_token");
  const rToken = ReadCookie("refresh_token");

  const gamePopup = useGamePopup();

  // const login = () => {
  // }

  const authenticateUser = () => {
    // this is temporary
    // here call the 42 portal to authenticate the user
    axios
      .get("http://localhost:3001/auth")
      .then((res: any) => {
        window.location.replace(res.data);
      })
      .catch((e) => console.log(e));
    // login()
    // setAuthenticated(true);
  };

  useEffect(() => {
    if (!aToken) {
      console.log("login");
      // login()
      setAuthenticated(false);
    } else if (isTokenExpired(aToken)) {
      console.log("Atoken Expired");
      if (!rToken || isTokenExpired(rToken)) {
        console.log("No Rt or expired");
        setAuthenticated(false);
        // login()
      } else {
        console.log("posting");
        axios
          .post(
            "http://localhost:3001/auth/refresh",
            {},
            { withCredentials: true }
          )
          .then(() => {
            window.location.reload();
          })
          .catch((e) => console.log(e));
      }
    } else setAuthenticated(true);
  }, []);

  const guestUser = () => {
    setGuest(true);
  };

  return (
    <div className="log_window">
      {gamePopup.isVisible && <MatchmakingPopup/>}
      {/* add querry here to check if authentification token was filled */}
      {authenticated && (
        <div className="header">
          <button className="btn btn-light" onClick={() => navigate("/profil")}>
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
          {/* {(authenticated || guest) && <button className="btn btn-light">play</button>} */}
          {(authenticated || guest) && <PlayGameModeDialogButton />}
        </div>
        <div className="col-md-4">
          <button className="btn btn-light" onClick={() => {gamePopup.setIsVisible(!gamePopup.isVisible)}} >leaderboard</button>
          {/* <button className="btn btn-light" onClick={() => navigate("/leaderboard")}>leaderboard</button> */}
        </div>
      </div>
    </div>
  );
};

export default Welcome;

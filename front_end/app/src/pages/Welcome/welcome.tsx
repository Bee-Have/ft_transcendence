import React, { useEffect } from "react";
import PlayGameModeDialogButton from "../../components/game/GameModeDialog/PlayGameModeDialogButton";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReadCookie } from "../../components/ReadCookie";
import { BACKEND_URL } from "../global/env";
import isTokenExpired from "../global/isTokenExpired";

import { useSessionContext } from "src/context/SessionContext";

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
  const session = useSessionContext();
  const TFA = ReadCookie("TfaEnable");

  const gamePopup = useGamePopup();

  const authenticateUser = () => {
    axios
      .get(BACKEND_URL + "/auth")
      .then((res: any) => {
        window.location.replace(res.data);
      })
      .catch((e) => console.log(e));
    if (session.aToken && TFA) {
      alert("2FA require here");
    }
  };

  useEffect(() => {
    if (
      (session.aToken === null || session.rToken === null) &&
      TFA !== "true"
    ) {
      session.updateTokens?.();
      return;
    }
    if (!session.aToken) {
      if (TFA === "true") {
        set2FA(true);
        console.log("2FA: ", TFA);
      } else {
        console.log("login");
        setAuthenticated(false);
      }
    } else if (isTokenExpired(session.aToken)) {
      console.log("Atoken Expired");
      if (!session.rToken || isTokenExpired(session.rToken)) {
        console.log("No Rt or expired");
        setAuthenticated(false);
      } else {
        console.log("posting");
        axios
          .post(BACKEND_URL + "/auth/refresh", {}, { withCredentials: true })
          .then(() => {
            window.location.reload();
          })
          .catch((e) => console.log(e));
      }
    } else {
      setAuthenticated(true);
      resetUserId();
    }
  }, [session.aToken, session.rToken]);

  const guestUser = () => {
    setGuest(true);
  };

  return (
    <div className="log_window">
      {print2FA && <TFAConnection popUp={set2FA} btn={setAuthenticated} />}
      {authenticated && (
        <div className="header">
          <button
            className="btn btn-light"
            onClick={() => navigate(`/profil/` + userId)}
          >
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
          <button
            className="btn btn-light"
            onClick={() => {
              gamePopup.setIsVisible(!gamePopup.isVisible);
              navigate("/user/leaderboard");
            }}
          >
            leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

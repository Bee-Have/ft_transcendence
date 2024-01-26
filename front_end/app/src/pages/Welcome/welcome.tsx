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
import { userId } from "../global/userId";

function Welcome() {
  const navigate = useNavigate();

  const [print2FA, set2FA] = React.useState(false);
  const session = useSessionContext();
  const TFA = ReadCookie("TfaEnable");

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
      session.updateTokens();
      return;
    }
    if (!session.aToken) {
      if (TFA === "true") {
        set2FA(true);
      } else {
      }
    } else if (isTokenExpired(session.aToken)) {
      if (!session.rToken || isTokenExpired(session.rToken)) {
      } else {
        axios
          .post(BACKEND_URL + "/auth/refresh", {}, { withCredentials: true })
          .then(() => {
            window.location.reload();
          })
          .catch((e) => console.log(e));
      }
    } else {
      session.login();
    }
  }, [session.aToken, session.rToken]);

  if (session.isLogged === false) {
    return (
      <div className="log_window">
        {print2FA && <TFAConnection popUp={set2FA} />}
        <h1 className="display-1 welcome">welcome</h1>
        <div className="login-choice">
          <div>
            <button className="btn btn-light" onClick={authenticateUser}>
              login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="log_window">
      <div className="header">
        <button
          className="btn btn-light"
          onClick={() => navigate(`/profil/` + userId)}
        >
          profile
        </button>
      </div>
      <h1 className="display-1 welcome">welcome</h1>
      <div className="logged-bar">
        <div className="col-md-4">
          <button className="btn btn-light" onClick={() => navigate("/chat")}>
            chat
          </button>
        </div>
        <div className="col-md-4">
          <PlayGameModeDialogButton />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-light"
            onClick={() => {
              navigate("/user/leaderboard");
            }}
          >
            leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

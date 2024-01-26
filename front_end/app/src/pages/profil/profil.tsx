import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { ReadCookie } from "src/components/ReadCookie";
import Menu from "src/components/menu";
import "src/css/profil.css";
import { BACKEND_URL } from "../global/env";

import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";

import { useSessionContext } from "src/context/SessionContext";
import { userId } from "../global/userId";


const Profil: React.FC = () => {
  const [realName, setRealName] = useState("Default");
  const [userName, setUserName] = useState("Default");
  const [profilePic, setProfilePic] = useState(
    require("src/asset/default.jpg")
  );
  const [description, setDescription] = useState("Default");
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const errorContext = useErrorContext()
  const session = useSessionContext();

  const { id } = useParams()

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/user/profile/${id}`, { withCredentials: true })
      .then(function (response) {
        setRealName(response.data.realname);
        setUserName(response.data.username);
        setProfilePic(BACKEND_URL + `/user/image/${id}`);
        setWins(response.data.win);
        setLoses(response.data.loose);
        setScore(response.data.score);
        setDescription(response.data.description);
      })
      .catch((err) => {
		    errorContext.newError?.(errorHandler(err))
        navigate('/profil/' + userId)
      });
  }, [id, session.socket]);

  return (
    <div className="content">
      <div className="header">
        {id !== ReadCookie("userId") && (
          <>
            <button className="btn btn-light">invit to game</button>
            <button className="btn btn-light">add friend</button>
          </>
        )}
        {id === ReadCookie("userId") && (
          <button
            className="btn btn-light"
            onClick={() => navigate("/profil/edit-Profil")}
          >
            edit profil
          </button>
        )}
        <button
          className="btn btn-light"
          onClick={() => {
            axios
              .post(
                BACKEND_URL + "/auth/logout",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${ReadCookie("access_token")}`,
                  },
                  withCredentials: true,
                }
              )
              .then(() => {
                session.logout?.();
                navigate("/");
              });
          }}
        >
          Logout
        </button>
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <Menu />
      <div className="profil">
        <center>
          <Avatar
            className="avatar"
            src={profilePic}
            style={{ width: "100px", height: "100px" }}
          />
          <br />
        </center>
        <div className="information">
          <div className="fs-2">
            Nickname : <br />
            <div style={{ paddingLeft: "5%" }}>
              {userName} ({realName})<br />
              <br />
            </div>
            <hr />
            <h3>Games statistics:</h3>
            <div style={{ paddingLeft: "5%" }}>
              Win : {wins} {"\u00A0"}
              {"\u00A0"} - {"\u00A0"}
              {"\u00A0"} Lose : {loses} <br />
              <br />
              Current ELO : {score} <br />
              <br />
            </div>
            {description ? (
              <>
                <hr />
                About me : <br />
                <div style={{ paddingLeft: "5%" }}>{description}</div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;

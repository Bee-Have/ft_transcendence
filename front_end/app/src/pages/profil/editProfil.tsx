import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios, { AxiosError } from "axios";

import Avatar from "@mui/material/Avatar";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import FAEnable from "src/components/2FAEnable";
import FADisable from "src/components/2FADisable";
import Menu from "src/components/menu";
import "src/css/profil.css";
import { ReadCookie } from "src/components/ReadCookie";
import { BACKEND_URL } from "../global/env";
import { userId } from "../global/userId";
import { errorHandler } from "src/context/errorHandler";
import { useErrorContext } from "src/context/ErrorContext";

const EditProfil: React.FC = () => {
  const navigate = useNavigate();
  const [realName, setRealName] = useState("Default");
  const [userName, setUserName] = useState("Default");
  const [description, setDescription] = useState("");
  const [printPopUp, setPopUp] = useState<boolean>(false);
  const [FAActive, setFAActive] = useState<boolean>(
    ReadCookie("TfaEnable") === "true"
  );
  const [profilePic, setProfilePic] = useState(
    require("src/asset/default.jpg")
  );
  const [newProfilePic, setNewProfilePic] = useState<string | null>(null);
  const errorContext = useErrorContext();

  const SelectorImage = (event: any) => {
    const file = event.target.files?.[0];
    setNewProfilePic(event.target.files[0]);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleEditPicture = () => {
    const inputElement = document.getElementById("selectorImage");
    if (inputElement) inputElement.click();
  };

  const handleToggleFA = () => {
    setPopUp(true);
  };

  const handle_submit = (e: any) => {
    e.preventDefault();

    axios
      .post(
        BACKEND_URL + "/user/update/description",
        { description },
        { withCredentials: true }
      )
      .then((res: any) => {})
      .catch((e: Error | AxiosError) => {
        errorContext.newError?.(errorHandler(e));
      });

    axios
      .post(
        BACKEND_URL + "/user/update/username",
        { username: userName },
        { withCredentials: true }
      )
      .then((res: any) => {})
      .catch((e: Error | AxiosError) => {
        errorContext.newError?.(errorHandler(e));
      });

    if (newProfilePic) {
      axios
        .postForm(
          BACKEND_URL + "/user/upload/avatar",
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            avatar: newProfilePic,
          },
          { withCredentials: true }
        )
        .then((res: any) => {})
        .catch((e: Error | AxiosError) =>
          errorContext.newError?.(errorHandler(e))
        );
    }

    navigate("/profil/edit-Profil");
  };

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/user/profile/edit", { withCredentials: true })
      .then((response: any) => {
        setRealName(response.data.realname);
        setUserName(response.data.username);

        setFAActive(response.data.isTwoFAEnable);
        if (response.data.description === null) setDescription("");
        else setDescription(response.data.description);

      })
      .catch((err: Error | AxiosError) => {
        errorContext.newError?.(errorHandler(err));
      });
      setProfilePic(BACKEND_URL + `/user/image/${userId}` + '?key=' + Math.random());

    // eslint-disable-next-line
  }, []);

  return (
    <div className="content">
      <input
        type="file"
        accept="image/*"
        id="selectorImage"
        style={{ display: "none" }}
        onChange={SelectorImage}
      />
      {printPopUp && !FAActive && (
        <FAEnable popUp={setPopUp} btn={setFAActive} />
      )}
      {printPopUp && FAActive && (
        <FADisable popUp={setPopUp} btn={setFAActive} />
      )}
      <div className="header">
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <Menu />
      <div className="profil">
        <form onSubmit={handle_submit} id="editprofilform">
          <center>
            <Avatar
              className="avatar"
              src={profilePic || require("src/asset/default.jpg")}
              style={{ width: "100px", height: "100px" }}
            />
            <br />
            <button type="button" onClick={handleEditPicture}>
              Edit picture
            </button>
          </center>
          <div className="information">
            <InputLabel htmlFor="component-simple" id="profil-form">
              Nickname
            </InputLabel>
            <Input
              id="component-simple"
              value={userName}
              onChange={(e: any) => setUserName(e.target.value)}
            />
            <br />
            <br />
            <InputLabel htmlFor="component-simple">RealName</InputLabel>
            {realName}
            <br />
            <br />
            <TextField
              label="Description"
              id="edit-description-area"
              multiline
              rows={10}
              value={description}
              style={{ width: "80%" }}
              onChange={function (e: any) {
                setDescription(e.target.value);
              }}
            />
            <br />
            <br />
            Two factor authentification :<br />
            <FormControlLabel
              id="form2Auth"
              control={<Switch />}
              label={FAActive ? "activer" : "désactiver"}
              checked={FAActive}
              onChange={handleToggleFA}
            />
            <div style={{ width: "100%" }}>
              <button style={{ marginLeft: "75%" }} type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfil;

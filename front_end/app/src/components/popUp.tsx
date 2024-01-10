import React from "react";

import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import InviteSpectateButton from "./DynamicInviteSpectateButton";
import Menu from "@mui/material/Menu";

import { Friend } from "../pages/global/friend.dto";

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";

interface PopUpProps {
  user: Friend;
  anchorEl: HTMLElement | null;
  setAnchorEl: (event: HTMLElement | null) => void;
}

function PopUp({ user, anchorEl, setAnchorEl }: PopUpProps) {
  // const navigate = useNavigate();
  // const squareStyle: React.CSSProperties = {
  //   position: 'absolute',
  //   paddingTop: '20px',
  //   left: `${x}px`,
  //   top: `${y}px`,
  // };

  // return(
  //   <div style={squareStyle} className='popUp'>
  //   {/* make a query string for other users profiles when they are implemented */}
  //     <span className="btn d-block p-2" onClick={() => navigate("/profil")}>Profil</span>
  //     <span><InviteSpectateButton /></span>
  //   {/* link navigate to specific private message */}
  //     <span className="btn d-block p-2" onClick={() => navigate("/chat")} >Message</span>
  //     <span className="btn d-block p-2">add friend</span>
  //   </div>
  // )

  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/profil")}
      >
        profile
      </Button>

      <InviteSpectateButton user={user} />

      <Button
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/chat")}
      >
        chat
      </Button>

      <Button className={styles.ButtonDialogOpen} onClick={handleClose}>
        add friend
      </Button>
    </Menu>
  );
}

export default PopUp;

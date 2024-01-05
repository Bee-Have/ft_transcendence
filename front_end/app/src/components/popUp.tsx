import React from 'react';

import { useNavigate } from 'react-router-dom';

import InviteSpectateButton from './DynamicInviteSpectateButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import styles from "./game/GameModeDialog/InviteGameModeDialogButton.module.css";

interface PopUpProps {
    user: string;
    anchorEl: HTMLElement | null;
    setAnchorEl: (event: HTMLElement | null) => void;
  }

function PopUp( {user, anchorEl, setAnchorEl}: PopUpProps) {
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
        'aria-labelledby': 'basic-button',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoFocus={false}
      disableAutoFocusItem={true}
    >
      <MenuItem
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/profil")}
      >
        profile
      </MenuItem>

      <InviteSpectateButton />
      
      <MenuItem
        className={styles.ButtonDialogOpen}
        onClick={() => navigate("/chat")}
      >
        chat
      </MenuItem>
      
      <MenuItem
        className={styles.ButtonDialogOpen}
        onClick={handleClose}
      >
        add friend
      </MenuItem>
    </Menu>
  )
};

export default PopUp;
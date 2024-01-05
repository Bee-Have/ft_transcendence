import * as React from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import { useNavigate } from "react-router-dom";
import { DialogContent, Box, Avatar } from "@mui/material";

import Divider from "@mui/material/Divider";

import styles from "./InviteGameModeDialogButton.module.css";

const modes = ["classic", "timed", "speed", "retro"];
const availableModes = ["classic", "timed", "speed", "retro"];

export interface GameModeDialogProps {
  open: boolean;
  selectedMode: string;
  onClose: (value: string) => void;
  updateGameMode: (value: string) => void;
  username: string;
}

function GameModeDialog(props: GameModeDialogProps) {
  const { onClose, selectedMode, open, updateGameMode, username } = props;
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(selectedMode);
  };

  const handleListItemClick = (value: string) => {
    updateGameMode(value);
  };

  const handleLaunchGame = () => {
    navigate("/game/" + selectedMode + "?multi=true");
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogContent className={styles.DialogContent}>
        <DialogTitle className={styles.DialogTitle}>
          Choose your game mode
        </DialogTitle>
        <Divider />
        <br />
        <Box className={styles.Box}>
          <Avatar className={styles.Avatar}/>
          {username}
        </Box>
        <br />
        <Divider />
        {/* The list should be two row and three columns */}

        <List className={styles.List}>
          {modes.map((mode) => {
            if (mode === selectedMode) {
              return (
                <ListItem disableGutters key={mode}>
                  {/* Make each button blue and evenly spaced */}
                  <ListItemButton
                    className={styles.SelectedItem}
                    onClick={() => handleListItemClick(mode)}
                  >
                    <ListItemText primary={mode} />
                  </ListItemButton>
                </ListItem>
              );
            }
            return (
              <ListItem disableGutters key={mode}>
                {/* Make each button grey and evenly spaced */}
                <ListItemButton
                  disabled={availableModes.includes(mode) === false}
                  className={styles.Item}
                  onClick={() => handleListItemClick(mode)}
                >
                  <ListItemText primary={mode} />
                </ListItemButton>
              </ListItem>
            );
          })}
          {/* Add bottom button independant from list items */}
        </List>
        <Divider />
        <br />
        <Button className={styles.StartGameButton} onClick={handleLaunchGame}>
          send Invite
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface InviteGameModeDialogButtonProps {
	username: string;
	// image user icon
}

function InviteGameModeDialogButton({ username /*TODO: , user icon here */ }: InviteGameModeDialogButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedMode, setSelectedMode] = React.useState(modes[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const updateGameMode = (value: string) => {
    setSelectedMode(value);
  };

  return (
    <div>
      <Button className={styles.ButtonDialogOpen} onClick={handleClickOpen}>
        invite to game
      </Button>
      <GameModeDialog
        selectedMode={selectedMode}
        open={open}
        onClose={handleClose}
        updateGameMode={updateGameMode}
        username={username}
      />
    </div>
  );
}

export default InviteGameModeDialogButton;

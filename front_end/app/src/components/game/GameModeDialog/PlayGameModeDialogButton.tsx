import * as React from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import { useNavigate } from "react-router-dom";
import { Box, CardContent, DialogContent } from "@mui/material";

import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";

import RobotIcon from "@mui/icons-material/SmartToyTwoTone";
import PersonIcon from "@mui/icons-material/PersonOutlineTwoTone";
import WarningIcon from "@mui/icons-material/WarningAmberRounded";

import Divider from "@mui/material/Divider";

import styles from "./PlayGameModeDialogButton.module.css";

import gameService from "src/services/game";
import { userId } from "src/pages/global/userId";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

const modes = ["classic", "timed", "speed", "retro"];
const availableModes = ["classic", "timed", "speed", "retro"];

export interface GameModeDialogProps {
  open: boolean;
  selectedMode: string;
  onClose: (value: string) => void;
  updateGameMode: (value: string) => void;
}

function GameModeDialog(props: GameModeDialogProps) {
  const [isMulti, setIsMulti] = React.useState(false);
  const { onClose, selectedMode, open, updateGameMode } = props;
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(selectedMode);
  };

  const handleListItemClick = (value: string) => {
    updateGameMode(value);
  };

  const handleLaunchGame = () => {
    gameService
      .deleteUserInvites(userId)
      .then((res) => {
        console.log(res);
        socket?.emit("update-user-status", UserStatus[UserStatus.ingamesolo]);
        navigate("/game/" + selectedMode + "?multi=false");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const joinMatchmakingQueue = () => {
    console.log("launching matchmaking");
    gameService
      .joinMatchmaking(userId, selectedMode)
      .then((res) => {
        console.log(res);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
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
          <RobotIcon
            style={{
              color: "#26640a",
              fontSize: isMulti === true ? 25 : 50,
              transition: "0.5s",
            }}
          />
          <Card className={styles.SwitchCard} elevation={3}>
            <CardContent>
              <Switch
                classes={{
                  switchBase: styles.Base,
                  track: styles.Track,
                  checked: styles.Checked,
                  root: styles.Root,
                }}
                checked={isMulti}
                onChange={() => setIsMulti(!isMulti)}
                name="gameType"
                color="primary"
              />
            </CardContent>
          </Card>
          <PersonIcon
            style={{
              color: "rgb(43, 100, 185)",
              fontSize: isMulti === false ? 25 : 50,
              transition: "0.5s",
            }}
          />
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
        <div className={styles.Disclaimer}>
          <WarningIcon />
          Starting a game cancels all invites and matchmaking
        </div>
        <Divider />
        <br />
        <Button
          className={styles.StartGameButton}
          onClick={isMulti === false ? handleLaunchGame : joinMatchmakingQueue}
        >
          {isMulti === false ? "Start Game" : "Matchmaking"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PlayGameModeDialogButton() {
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
      <Button
        className={styles.ButtonDialogOpen}
        variant="outlined"
        onClick={handleClickOpen}
      >
        play
      </Button>
      <GameModeDialog
        selectedMode={selectedMode}
        open={open}
        onClose={handleClose}
        updateGameMode={updateGameMode}
      />
    </div>
  );
}

export default PlayGameModeDialogButton;

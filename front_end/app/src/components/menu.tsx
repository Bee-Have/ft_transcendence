import React from "react";

import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import styles from "./menu.module.css";
import { ReadCookie } from "./ReadCookie";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState("");

  React.useEffect(() => {
    const pathname = window.location.pathname.split("/")[2];
    if (pathname === undefined) setCurrentPage("profil");
    else setCurrentPage(pathname);
  }, []);

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={styles.Menu}
    >
      <ListItemButton
        onClick={() => navigate(`/profil/${ReadCookie("userId")}`)}
        defaultChecked
        className={
          currentPage === "profil"
            ? styles.SelectedMenuButton
            : styles.MenuButton
        }
      >
        <ListItemText primary="Profile" />
      </ListItemButton>

      <Divider />

      <ListItem className={styles.MenuItem}>
        <ListItemText primary="Friend list" />
      </ListItem>

      <Box>
        <List component="div" disablePadding>
          <ListItemButton
            className={
              currentPage === "friend-list"
                ? styles.SelectedSubMenuButton
                : styles.SubMenuButton
            }
            onClick={() => navigate("/profil/friend-list")}
          >
            <ListItemText primary="all friends" />
          </ListItemButton>
          <ListItemButton
            className={
              currentPage === "pending-friend-request"
                ? styles.SelectedSubMenuButton
                : styles.SubMenuButton
            }
            onClick={() => navigate("/profil/pending-friend-request")}
          >
            <ListItemText primary="pending invitations" />
          </ListItemButton>
          <ListItemButton
            className={
              currentPage === "blocked"
                ? styles.SelectedSubMenuButton
                : styles.SubMenuButton
            }
            onClick={() => navigate("/profil/blocked")}
          >
            <ListItemText primary="blocked users" />
          </ListItemButton>
        </List>
      </Box>

      <Divider />

      <ListItemButton
        onClick={() => navigate("/profil/match-history")}
        className={
          currentPage === "match-history"
            ? styles.SelectedMenuButton
            : styles.MenuButton
        }
      >
        <ListItemText primary="match history" />
      </ListItemButton>
    </List>
  );
};

export default Menu;

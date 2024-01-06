import React from "react";

import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import styles from "./menu.module.css";

// interface MenuProps {
//   updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
// }

// const Menu: React.FC<MenuProps> = ({ updateBooleanStates }) => {
const Menu: React.FC = () => {
  //   return (
  //     <div className="menu">
  //       <div className="btn-group-vertical w-100" role="group" aria-label="Vertical radio toggle button group">
  //         <input type="radio" className="btn-check " name="vbtn-radio" id="vbtn-radio1" autoComplete="off" onClick={() => navigate("/profil")} defaultChecked />
  //         {/* <input type="radio" className="btn-check " name="vbtn-radio" id="vbtn-radio1" autoComplete="off" onClick={() => updateBooleanStates({ showProfil: true, showMenu: true })} defaultChecked /> */}
  //         <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio1">Profile</label>

  //         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" onClick={() => navigate("/profil/friend-list")}/>
  //         {/* <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" onClick={() => updateBooleanStates({ showFriendList: true, showMenu: true })}/> */}
  //         <label className="btn btn-outline-primary fs-1 text-start">Friend list</label>

  //         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" onClick={() => navigate("/profil/friend-list")} />
  //         {/* <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" onClick={() => updateBooleanStates({ showFriendList: true, showMenu: true })} /> */}
  //         <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio3">all friends</label>
  //         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" onClick={() => navigate("/profil/pending-friend-request")}/>
  //         {/* <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" onClick={() => updateBooleanStates({ showPendingList: true, showMenu: true })}/> */}
  //         <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio4">pending invitations</label>
  //         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" onClick={() => navigate("/profil/blocked")} />
  //         {/* <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" onClick={() => updateBooleanStates({ showBlockedList: true, showMenu: true })} /> */}
  //         <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio5">blocked users</label>

  //         <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" onClick={() => navigate("/profil/match-history")} />
  //         {/* <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" onClick={() => updateBooleanStates({ showHistoryMatch: true, showMenu: true })} /> */}
  //         <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio6">match history</label>
  //     	</div>
  //   	</div>
  //   );

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
        onClick={() => navigate("/profil")}
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

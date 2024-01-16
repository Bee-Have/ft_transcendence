import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

import "./App.css";
import "./bootstrap/css/bootstrap.css";

import Pending from "./pages/pending/pendingMabriel";
import Welcome from "./pages/Welcome/welcome";
import Profil from "./pages/profil/profil";
import FriendList from "./pages/friend-list/FriendsList";
import Blocked from "./pages/blocked/blockedMabriel";
import MatchHistory from "./pages/match-history/matchHistory";
import Chat from "./pages/chat/chat";
import EditProfil from "./pages/profil/editProfil";

import RedirectGame from "./pages/game/RedirectGame";

import ClassicGame from "./pages/game/solo/Classic";
import ClassicGamePvp from "./pages/game/pvp/Classic";
import TimedGame from "./pages/game/solo/Timed";
import SpeedGame from "./pages/game/solo/Speed";
import RetroGame from "./pages/game/solo/Retro";

import RedirectInvalidURL from "./pages/game/RedirectInvalidURL";

import GamePopupList from "src/components/game/GamePopup/GamePopupList";

const App: React.FC = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {};
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <GamePopupList />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profil/friend-list" element={<FriendList />} />
          <Route path="/profil/pending-friend-request" element={<Pending />} />
          <Route path="/profil/blocked" element={<Blocked />} />
          <Route path="/profil/match-history" element={<MatchHistory />} />
          <Route path="/profil/edit-Profil" element={<EditProfil />} />
          <Route path="/chat" element={<Chat />} />

		  <Route path="/game/redirect" element={<RedirectGame />} />

          <Route path="/game/training/classic" element={<ClassicGame />} />
          <Route path="/game/classic" element={<ClassicGamePvp />} />
          <Route path="/game/training/timed" element={<TimedGame />} />
          <Route path="/game/training/speed" element={<SpeedGame />} />
          <Route path="/game/training/retro" element={<RetroGame />} />

          <Route path="*" element={<RedirectInvalidURL />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

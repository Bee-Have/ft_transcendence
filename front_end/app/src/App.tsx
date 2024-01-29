import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import "./App.css";
import "./bootstrap/css/bootstrap.css";

import Pending from "./pages/pending/pendingMabriel";
import Welcome from "./pages/Welcome/welcome";
import Profil from "./pages/profil/profil";
import FriendList from "./pages/friend-list/FriendsList";
import Blocked from "./pages/blocked/Blocked";
import MatchHistory from "./pages/match-history/matchHistory";
import Chat from "./pages/chat/chat";
import EditProfil from "./pages/profil/editProfil";

import Leaderboard from 'src/pages/leaderboard/leaderboard';

import Channel from './pages/channel/Channel';
import ChannelJoiningList from './pages/channel/ChannelJoiningList';

import ChannelListBar from './pages/channel/components/ChannelListBar';

import RedirectGame from "./pages/game/RedirectGame";

import ClassicGame from "./pages/game/solo/Classic";
import GameRoomPvp from "./pages/game/pvp/GameRoom";
import TimedGame from "./pages/game/solo/Timed";
import SpeedGame from "./pages/game/solo/Speed";
import RetroGame from "./pages/game/solo/Retro";

import RedirectInvalidURL from "./pages/game/RedirectInvalidURL";

import GamePopupList from "src/components/game/GamePopup/GamePopupList";
import AxiosNavigation from './pages/global/AxiosNavigation';

const App: React.FC = () => {

	const [update, setUpdate] = useState<boolean>(false);

	const onUpdate = () => {
		setUpdate(!update);
	}


	useEffect(() => {
		const handleMessage = (event: MessageEvent): void => { };
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	return (
		<>
			<BrowserRouter>
				<GamePopupList />
				<AxiosNavigation/>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/profil/:id" element={<Profil />} />
					<Route path="/profil/friend-list" element={<FriendList />} />
					<Route path="/profil/pending-friend-request" element={<Pending />} />
					<Route path="/profil/blocked" element={<Blocked />} />
					<Route path="/profil/match-history" element={<MatchHistory />} />
					<Route path="/profil/edit-Profil" element={<EditProfil />} />
					<Route path="/user/leaderboard" element={<Leaderboard />} />

					<Route path="/chat" element={<><ChannelListBar update={update} /><Outlet /></>}>
						<Route path="" element={<Chat />} />
						<Route path=":id" element={<Chat />} />
						<Route path="channel" element={<ChannelJoiningList onUpdate={onUpdate} />} />
						<Route path="channel/:id" element={<Channel />} />
					</Route>

					<Route path="/game/redirect" element={<RedirectGame />} />

					<Route path="/game/training/classic" element={<ClassicGame />} />
					<Route path="/game/pvp/" element={<GameRoomPvp />} />
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

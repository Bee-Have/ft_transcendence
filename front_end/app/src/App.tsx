import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  React, { useEffect } from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending			from './pages/pending/pendingMabriel';
import  Welcome     	from './pages/Welcome/welcome';
import  Profil      	from './pages/profil/profil';
import  FriendList  	from './pages/friend-list/FriendsList';
import	Blocked			from './pages/blocked/blockedMabriel';
import	MatchHistory	from './pages/match-history/matchHistory';
import	Chat 			from './pages/chat/chat';
import	EditProfil		from './pages/profil/editProfil';

import Channel from './pages/channel/channel';
import Channels from './pages/channel/channels';

import ClassicGame from "./pages/game/Classic";
import TimedGame from "./pages/game/Timed";
import SpeedGame from "./pages/game/Speed";
import RetroGame from "./pages/game/Retro";


const App: React.FC = () => {
	useEffect(() => {
		const handleMessage = (event: MessageEvent): void => {
		};
		window.addEventListener('message', handleMessage);
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/profil" element={<Profil />} />
				<Route path="/profil/friend-list" element={<FriendList />} />
				<Route path="/profil/pending-friend-request" element={<Pending />} />
				<Route path="/profil/blocked" element={<Blocked />} />
				<Route path="/profil/match-history" element={<MatchHistory />} />
				<Route path="/profil/edit-Profil" element={<EditProfil />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/channel/:id" Component={Channel} />
				<Route path="/channel" Component={Channels} />
				<Route path="/game/classic" element={<ClassicGame />} />
				<Route path="/game/timed" element={<TimedGame />} />
				<Route path="/game/speed" element={<SpeedGame />} />
				<Route path="/game/retro" element={<RetroGame />} />
				<Route path="*" element={<p>404 Not found</p> } />
				{/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
			</Routes>
		</BrowserRouter>
	);
};

export default App;
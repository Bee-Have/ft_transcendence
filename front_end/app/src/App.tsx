import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  React, { useEffect } from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending			from './pages/pending';
import  Welcome     	from './pages/welcome';
import  Profil      	from './pages/profil';
import  FriendList  	from './pages/friendList';
import	Blocked			from './pages/blocked';
import	MatchHistory	from './pages/matchHistory';
import	Chat 			from './pages/chat';
import	EditProfil		from './pages/editProfil';


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
				{/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
			</Routes>
		</BrowserRouter>
	);
};

export default App;
import  React from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending				from './pages/pending/pendingMabriel';
import  Welcome     	from './pages/Welcome/welcome';
import  Profil      	from './pages/profil/profil';
import  FriendList  	from './pages/friend-list/FriendsList';
import	Blocked				from './pages/blocked/blockedMabriel';
import	MatchHistory	from './pages/match-history/matchHistory';
import	Chat 					from	'./pages/chat/chat';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { ReadCookie } from './components/ReadCookie';

const App: React.FC = () => {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/profile" element={<Profil />} />
				<Route path="/profil/friend-list" element={<FriendList />} />
				<Route path="/profil/pending-friend-request" element={<Pending />} />
				<Route path="/profil/blocked" element={<Blocked />} />
				<Route path="/profil/match-history" element={<MatchHistory />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="*" element={<p>404 Not found</p> } />
				{/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
			</Routes>
		</BrowserRouter>
	);
};

export default App;
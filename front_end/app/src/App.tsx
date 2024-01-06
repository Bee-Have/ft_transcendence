// import  React, { useState, useEffect} from 'react';
import  React from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending				from './pages/pending/pendingMabriel';
import  Welcome     	from './pages/Welcome/welcome';
// import  Menu        	from './components/menu';
import  Profil      	from './pages/profil/profil';
// import  Header      	from './components/header';
import  FriendList  	from './pages/friend-list/FriendsList';
import	Blocked				from './pages/blocked/blockedMabriel';
import	MatchHistory	from './pages/match-history/matchHistory';
import	Chat 					from	'./pages/chat/chat';
//import sendBack, {sendBackPost} from './files/sendBack';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {

	// const [showMenu, setMenu]									= useState(false);
	// const [showChat, setChat]									= useState(true);
	// const [isLogged, setLogStatus]						= useState(true);
	// const [showWelcome, setWelcome] 					= useState(false);
	// const [showProfil, setViewProfil] 				= useState(false);
	// const [showOverlay, setShowOverlay] 			= useState(false);
	// const [showFriendList, setFriendList] 		= useState(false);
	// const [showPendingList, setPendingList] 	= useState(false);
	// const [showBlockedList, setBlockedList] 	= useState(false);
	// const [showHistoryMatch, setHistoryMatch] = useState(false);

	// const updateBooleanStates = (statesToUpdate: {
	// 	showChat?: boolean;
	// 	showMenu?: boolean;
	// 	showProfil?: boolean;
	// 	showWelcome?: boolean;
	// 	showFriendList?: boolean;
	// 	showPendingList?: boolean;
	// 	showBlockedList?: boolean;
	// 	showHistoryMatch?: boolean;
	// }): void => {
	// 	setChat(statesToUpdate.showChat || false);
	// 	setMenu(statesToUpdate.showMenu || false);
	// 	setWelcome(statesToUpdate.showWelcome || false);
	// 	setViewProfil(statesToUpdate.showProfil || false);
	// 	setFriendList(statesToUpdate.showFriendList || false);
	// 	setPendingList(statesToUpdate.showPendingList || false);
	// 	setBlockedList(statesToUpdate.showBlockedList || false);
	// 	setHistoryMatch(statesToUpdate.showHistoryMatch || false);
	// };

//	const openLoginWindow = (): void => {
//		setShowOverlay(true);
//
//		sendBack('http://localhost:3001/auth').then(function (data)
//		{
//			let url = data ? data.data : ""
//			
//			const newWindow = window.open(url, '_blank', 'width=400,height=200');
//
//			if (newWindow) {
//				newWindow.addEventListener('beforeunload', () => {
//					setShowOverlay(false);
//				});
//			}
//			
//		})
//	};
	
	// const acceptConnection = (): void => {
	// 	setLogStatus(true);
	// };


	// const logout = (): void => {
		// alert("add here question <did you want to disconnected ?>");
		// here set navigate query to show walcome not logged
		// updateBooleanStates({showWelcome: true});
		// setLogStatus(false);
		// alert("You are now disconnected !");
	// };


//	useEffect(() => {
//		const handleMessage = (event: MessageEvent): void => {
//			// if (event.data === "OK")
//				// setLogStatus(true);
//		};
//		window.addEventListener('message', handleMessage);
//
//		return () => {
//			window.removeEventListener('message', handleMessage);
//		};
//	}, []);
	

	// return (
	// 	<div className="App">
	// 		<Header isLogged={isLogged} showProfil={showProfil} showChat={showChat} updateBooleanStates={updateBooleanStates} logout={logout} />
	// 		{showOverlay && <div className="overlay"></div>}
	// 		{showWelcome && (<Welcome isLogged={isLogged} openLoginWindow={openLoginWindow} 
	// 												acceptConnection={acceptConnection} updateBooleanStates={updateBooleanStates} />)}
	// 		{showMenu && <Menu updateBooleanStates={updateBooleanStates} />}
	// 		{showProfil && <Profil/>}
	// 		{showFriendList && <FriendList/>}
	// 		{showPendingList && <Pending/>}
	// 		{showBlockedList && <Blocked/>}
	// 		{showHistoryMatch && <MatchHistory/>}
	// 		{showChat && <Chat/>}
	// 	</div>
	// );
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/profil" element={<Profil />} />
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
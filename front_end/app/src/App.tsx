import  React, { useState, useEffect} from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending				from './files/pending';
import  Welcome     	from './files/welcome';
import  Menu        	from './files/menu';
import  Profil      	from './files/profil';
import  Header      	from './files/header';
import  FriendList  	from './files/friendList';
import	Bloqued				from './files/blocked';
import	MatchHistory	from './files/matchHistory';
//import sendBack from './files/sendBack';


const App: React.FC = () => {

	const [showMenu, setMenu]									= useState(true);
	const [isLogged, setLogStatus]						= useState(true);
	const [showWelcome, setWelcome] 					= useState(false);
	const [showProfil, setViewProfil] 				= useState(true);
	const [showOverlay, setShowOverlay] 			= useState(false);
	const [showFriendList, setFriendList] 		= useState(false);
	const [showPendingList, setPendingList] 	= useState(false);
	const [showBloquedList, setBloquedList] 	= useState(false);
	const [showHistoryMatch, setHistoryMatch] = useState(false);

	const updateBooleanStates = (statesToUpdate: {
		showProfil?: boolean;
		showFriendList?: boolean;
		showPendingList?: boolean;
		showBloquedList?: boolean;
		showHistoryMatch?: boolean;
		showMenu?: boolean;
		showWelcome?: boolean;
	}): void => {
		setViewProfil(statesToUpdate.showProfil || false);
		setFriendList(statesToUpdate.showFriendList || false);
		setPendingList(statesToUpdate.showPendingList || false);
		setBloquedList(statesToUpdate.showBloquedList || false);
		setHistoryMatch(statesToUpdate.showHistoryMatch || false);
		setMenu(statesToUpdate.showMenu || false);
		setWelcome(statesToUpdate.showWelcome || false);
	};

	const acceptConnection = (): void => {
		setLogStatus(true);
	};

	const openLoginWindow = (): void => {
		setShowOverlay(true);
		const newWindow = window.open('', '_blank', 'width=400,height=200');

		if (newWindow) {
			newWindow.addEventListener('beforeunload', () => {
				alert('Fenêtre fermée');
				setShowOverlay(false);
			});
		}
	};
	
	const logout = (): void => {
		alert("add here question <did you want to disconnected ?>");
		updateBooleanStates({showWelcome: true});
		setLogStatus(false);
		alert("You are now disconnected !");
	};

	useEffect(() => {
		const handleMessage = (event: MessageEvent): void => {
			if (event.data === "OK")
				setLogStatus(true);
		};
		window.addEventListener('message', handleMessage);
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);

	return (
		<div className="App">
			<Header isLogged={isLogged} showProfil={showProfil} updateBooleanStates={updateBooleanStates} logout={logout} />
			{showOverlay && <div className="overlay"></div>}
			{showWelcome && (<Welcome isLogged={isLogged} openLoginWindow={openLoginWindow} acceptConnection={acceptConnection} />)}
			{showMenu && <Menu updateBooleanStates={updateBooleanStates} />}
			{showProfil && <Profil /> }
			{showFriendList && <FriendList/>}
			{showPendingList && <Pending/>}
			{showBloquedList && <Bloqued/>}
			{showHistoryMatch && <MatchHistory/>}
		</div>
	);
};

export default App;
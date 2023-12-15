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
import sendBack from './files/sendBack';

const App: React.FC = () => {

	const [showMenu, setMenu]					= useState(false);
	const [isLogged, setLogStatus]				= useState(false);
	const [showWelcome, setWelcome] 			= useState(true);
	const [showProfil, setViewProfil] 			= useState(false);
	const [showOverlay, setShowOverlay] 		= useState(false);
	const [showFriendList, setFriendList]		= useState(false);
	const [showPendingList, setPendingList] 	= useState(false);
	const [showBloquedList, setBloquedList]		= useState(false);
	const [showHistoryMatch, setHistoryMatch]	= useState(false);

	let pairs = {};

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

	function update_cookie()
	{
		if (document.cookie)
		{
			let temp = document.cookie;			
			let test = temp.split("=");
			let keys = test[1].split("%3B");
			
			for (let item in keys)
			{
				if (keys[item] === "")
					break;
				pairs[keys[item].split("%3D")[0].slice()] = keys[item].split("%3D")[1].slice();
			}
		}
	}

	const acceptConnection = (): void => {
		setLogStatus(true);
	};

	const openLoginWindow = (): void => {
		setShowOverlay(true);

		sendBack('http://localhost:3001/auth').then(function (data)
		{
			let url = data ? data.data : ""
			
			const newWindow = window.open(url, '_blank', 'width=400,height=200');

			if (newWindow) {
				newWindow.addEventListener('beforeunload', () => {
					setShowOverlay(false);
				});
			}
			
			update_cookie();
			
			if (pairs["logged"] === "true")
				acceptConnection();
		})
	};
	
	const logout = (): void => {
		alert("add here question <did you want to disconnected ?>");
		sendBack('http://localhost:3001/auth/logout').then(function () {
			updateBooleanStates({showWelcome: true});
			
//			setLogStatus(false);
//			document.cookie = "payload_cookie=logged%3Dfalse%3BsameSite%3DStrict%3B";
			
			alert("You are now disconnected !");
		})

	};

	useEffect(() => {
		const handleMessage = (event: MessageEvent): void => {
			if (event.data === "OK")
				setLogStatus(true);
		};
		window.addEventListener('message', handleMessage);
		
		update_cookie();
		if (pairs["logged"] === "true")
			acceptConnection();
		

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
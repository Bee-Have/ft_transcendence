import  React, { useState, useEffect} from 'react';

import  './App.css';
import  './bootstrap/css/bootstrap.css';

import  Pending						from './files/pendingMabriel';
import  Welcome     				from './files/welcome';
import  Menu        				from './files/menu';
import  Profil      				from './files/profil';
import  Header      				from './files/header';
import  FriendList  				from './files/FriendsList';
import	Bloqued						from './files/blockedMabriel';
import	MatchHistory				from './files/matchHistory';
import	{sendBackPost}	from './files/sendBack';
import	Chat						from	'./files/chat';
import { ReadCookie } from './files/ReadCookie';
import axios from 'axios';
import isTokenExpired from './files/global/isTokenExpired';


const App: React.FC = () => {

	const [showMenu, setMenu]					= useState(false);
	const [showChat, setChat]					= useState(false);
	const [isLogged, setLogStatus]				= useState(false);
	const [showWelcome, setWelcome] 			= useState(true);
	const [showProfil, setViewProfil] 			= useState(false);
	// const [showOverlay, setShowOverlay] 		= useState(false);
	const [showFriendList, setFriendList] 		= useState(false);
	const [showPendingList, setPendingList] 	= useState(false);
	const [showBloquedList, setBloquedList]		= useState(false);
	const [showHistoryMatch, setHistoryMatch]	= useState(false);

	// let pairs = {};

	const updateBooleanStates = (statesToUpdate: {
		showChat?: boolean;
		showMenu?: boolean;
		showProfil?: boolean;
		showWelcome?: boolean;
		showFriendList?: boolean;
		showPendingList?: boolean;
		showBloquedList?: boolean;
		showHistoryMatch?: boolean;
	}): void => {
		setChat(statesToUpdate.showChat || false);
		setMenu(statesToUpdate.showMenu || false);
		setWelcome(statesToUpdate.showWelcome || false);
		setViewProfil(statesToUpdate.showProfil || false);
		setFriendList(statesToUpdate.showFriendList || false);
		setPendingList(statesToUpdate.showPendingList || false);
		setBloquedList(statesToUpdate.showBloquedList || false);
		setHistoryMatch(statesToUpdate.showHistoryMatch || false);
	};

	// function update_cookie()
	// {
	// 	if (document.cookie)
	// 	{
	// 		// console.log(document.cookie)
	// 		// let temp = document.cookie;			
	// 		// let test = temp.split("=");
	// 		// console.log(test)
	// 		const payload = ReadCookie('payload_cookie')

	// 		let keys = payload?.split("%3B");
			
	// 		for (let item in keys)
	// 		{
	// 			if (keys[item] === "")
	// 				break;
	// 			pairs[keys[item].split("%3D")[0].slice()] = keys[item].split("%3D")[1].slice();
	// 		}
	// 	}
	// }

	const acceptConnection = (): void => {
		setLogStatus(true);
	};

	// const openLoginWindow = (): void => {
	// 	setShowOverlay(true);

	// 	sendBack('http://localhost:3001/auth').then(function (data)
	// 	{
	// 		let url = data ? data.data : ""
			
	// 		const newWindow = window.open(url, '_blank', 'width=400,height=200');

	// 		if (newWindow) {
	// 			newWindow.addEventListener('beforeunload', () => {
	// 				setShowOverlay(false);
	// 			});
	// 		}
			
	// 		update_cookie();
			
	// 		if (pairs["logged"] === "true")
	// 			acceptConnection();
	// 	})
	// };

	const login = () => {
		axios.get('http://localhost:3001/auth')
		.then((res: any) => {
			window.location.replace(res.data)
		})
		.catch(e => console.log(e))
	}
	
	const logout = (): void => {
		alert("add here question <did you want to disconnected ?>");
		sendBackPost('http://localhost:3001/auth/logout').then(function () {
			updateBooleanStates({showWelcome: true});
			
//			setLogStatus(false);
//			document.cookie = "payload_cookie=logged%3Dfalse%3BsameSite%3DStrict%3B";
			
//			alert("You are now disconnected !");
		})

	};

	useEffect(() => {
		// const handleMessage = (event: MessageEvent): void => {
		// 	if (event.data === "OK")
		// 		setLogStatus(true);
		// };
		// window.addEventListener('message', handleMessage);
		
		const aToken = ReadCookie('access_token')
		const rToken = ReadCookie('refresh_token')
		if (!aToken)
		{
			console.log('login')
			// login()
			setLogStatus(false)
		}
		else if ( isTokenExpired(aToken) )
		{
			console.log('Atoken Expired')
			if ( !rToken || isTokenExpired(rToken) )
			{
				console.log('No Rt or expired')
				setLogStatus(false)
			// login()
			}
			else
			{
				console.log('posting')
				axios.post('http://localhost:3001/auth/refresh', {}, { withCredentials:true })
				.then(() => {
					window.location.reload()
				})
				.catch((e) => console.log(e))
			}

		}
		else
			setLogStatus(true)

		// update_cookie();
		// if (pairs["logged"] === "true")
		// 	acceptConnection();
	
		// return () => {
		// 	window.removeEventListener('message', handleMessage);
		// };
	});
	

	return (
		<div className="App">
			<Header isLogged={isLogged} showProfil={showProfil} showChat={showChat} updateBooleanStates={updateBooleanStates} logout={logout} />
			{/* {showOverlay && <div className="overlay"></div>} */}
			{showWelcome && (<Welcome isLogged={isLogged} openLoginWindow={login} 
													acceptConnection={acceptConnection} updateBooleanStates={updateBooleanStates} />)}
			{showMenu && <Menu updateBooleanStates={updateBooleanStates} />}
			{showProfil && <Profil/>}
			{showFriendList && <FriendList/>}
			{showPendingList && <Pending/>}
			{showBloquedList && <Bloqued/>}
			{showHistoryMatch && <MatchHistory/>}
			{showChat && <Chat/>}
		</div>
	);
};

export default App;
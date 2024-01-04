import React from 'react';
import '../css/header.css';

import { useNavigate } from 'react-router-dom';

const logout = (): void => {
	alert("add here question <did you want to disconnected ?>");
	alert("You are now disconnected !");
};

interface HeaderProps {
  isLogged: boolean;
  showChat: boolean;
  showProfil: boolean;
}

const Header: React.FC<HeaderProps> = ({isLogged, showProfil, showChat}) => {
	const navigate = useNavigate();
	return (
		<div className="header">
			{isLogged && !showProfil && (
			<button className="btn btn-light" onClick={() => navigate("/profil")}>Profile</button>
		)}
		{showChat && (
			<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
	  	)}
		{showProfil && (
		<>
		  <button className="btn btn-light">Invite to game</button>
		  <button className="btn btn-light">edit profil</button>
		  <button className="btn btn-light" onClick={() => navigate("/")}>home</button>
		  <button className="btn btn-light" onClick={logout}>Logout</button>
		</>
	  )}
	</div>
  );
};

export default Header;
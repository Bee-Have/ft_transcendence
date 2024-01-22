import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Menu from 'src/components/menu';
import Avatar from '@mui/material/Avatar';
import 'src/css/profil.css';
import axios from 'axios';
import { ReadCookie, deleteCookie } from 'src/components/ReadCookie';



const Profil: React.FC = () => {

	const [realName, setRealName] = useState("Default");
	const [nickName, setNickName] = useState("Default");
	const [profilePic, setProfilePic] = useState(require("src/asset/default.jpg"));
	const [description, setDescription] = useState("Default");
	const [wins, setWins] = useState(0);
	const [loses, setLoses] = useState(0);
	const [score, setScore] = useState(0);
	const navigate = useNavigate();

	const id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);


	axios.get(`http://localhost:3001/user/profile/${id}`, {withCredentials: true})
	.then( function (response)
	{
		setRealName(response.data.username);
		if (response.data.nickname == null)
			setNickName(response.data.username);
		else
			setNickName(response.data.nickname);
		setProfilePic(`http://localhost:3001/user/image/${id}`);
		setWins(response.data.win);
		setLoses(response.data.loose);
		setScore(response.data.score);
		setDescription(response.data.description);
	})
	.catch(err => {
		console.log(err);
		//throw err;
	});

	useEffect(() => {
	}, [])

	return (
		<div className='content'>
			<div className="header">
				{id !== ReadCookie("userId") && 
					<>
                		<button className="btn btn-light">invit to game</button>
                		<button className="btn btn-light">add friend</button>
					</>
				}
				{id === ReadCookie("userId") && 
                	<button className="btn btn-light" onClick={() => navigate("/profil/edit-Profil")}>edit profil</button>
				}
                <button className="btn btn-light" onClick={() => {
					axios.post("http://localhost:3001/auth/logout", {}, {headers: {Authorization: `Bearer ${ReadCookie("access_token")}`}, withCredentials: true}).then( () =>
					{
						deleteCookie("access_token");
						deleteCookie("refresh_token");
						deleteCookie("TfaEnable");
						deleteCookie("userId");
						navigate("/")
					})
				}}>Logout</button>
                <button className="btn btn-light" onClick={() => navigate("/")}>home</button>
            </div>
			<Menu/>
			<div className='profil'>
				<center>
					<Avatar className='avatar' src={profilePic} style={{width:'100px', height:'100px'}}/><br/>
				</center>
				<div className='information'>
					<div className='fs-2'>
						Nickname : {nickName}<br /><br />
						Real Name : {realName}<br /><br />
						Win : {wins} {'\u00A0'}{'\u00A0'} - {'\u00A0'}{'\u00A0'} Lose : {loses} <br />
						Current ELO : {score} <br /><br />

						About me : <br />
						{ description }
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profil;
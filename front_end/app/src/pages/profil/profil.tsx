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
						En mathématiques, on définit une notion à partir de notions antérieurement définies.<br />
						Les notions de bases étant les symboles non logiques du langage considéré, dont l'usage est défini par les axiomes de la théorie.<br />
						Se pose la question de la différence entre une définition et un axiome.<br />
						Pour exemple, dans l'arithmétique de Peano, l'addition et la multiplication sont des symboles du langage et leur fonctionnement est régi par des axiomes.<br />
						Mais on pourrait tout à fait réduire le langage de l arithmétique en supprimant les symboles « + » et « * » et les définir à partir de 0 et de la fonction successeur d'une manière similaire.<br />
						Cela nous donnerait une autre théorie arithmétique, mais essentiellement équivalente sur toutes ses propriétés élémentaires.
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profil;
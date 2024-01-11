import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import FAEnable from 'src/components/2FAEnable';
import FADisable from 'src/components/2FADisable';
import Menu from 'src/components/menu';
import 'src/css/profil.css';
import { ReadCookie } from 'src/components/ReadCookie';

const EditProfil: React.FC = () => 
{
	const navigate = useNavigate();
	const [realName, setRealName] = useState("Default");
	const [nickName, setNickName] = useState("Default");
	const description = "En mathématiques, on définit une notion à partir de notions antérieurement définies.\n\
Les notions de bases étant les symboles non logiques du langage considéré, dont l'usage est défini par les axiomes de la théorie.\n\
Se pose la question de la différence entre une définition et un axiome.\n\
Pour exemple, dans l'arithmétique de Peano, l'addition et la multiplication sont des symboles du langage et leur fonctionnement est régi par des axiomes.\n\
Mais on pourrait tout à fait réduire le langage de l arithmétique en supprimant les symboles « + » et « * » et les définir à partir de 0 et de la fonction successeur d'une manière similaire.\n\
Cela nous donnerait une autre théorie arithmétique, mais essentiellement équivalente sur toutes ses propriétés élémentaires."
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [printPopUp, setPopUp] = useState<boolean>(false);
	const [FAActive, setFAActive] = useState<boolean>(false);
	const [profilePic, setProfilePic] = useState(require("src/asset/default.jpg"));

	const SelectorImage = (event: ChangeEvent<HTMLInputElement>) => 
	{
		const file = event.target.files?.[0];
		if (file)
		{
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
		}
	};

	const handleEditPicture = () =>
	{
		const inputElement = document.getElementById('selectorImage');
		if (inputElement) 
			inputElement.click();
	};

	const handleToggleFA = () => {
		setPopUp(true);
	};

	axios.get(`http://localhost:3001/user/profile/${ReadCookie("userId")}`, {withCredentials: true})
	.then( function (response)
	{
		setRealName(response.data.username);
		if (response.data.nickname == null)
			setNickName(response.data.username);
		else
			setNickName(response.data.nickname);
		setProfilePic(`http://localhost:3001/user/image/${ReadCookie("userId")}`);
	})
	.catch(err => {
		console.log(err);
		//throw err;
	});

	useEffect(() => {
	}, [])

	return (
		<div className='content'>
			<input
				type="file"
				accept="image/*"
				id="selectorImage"
				style={{display:'none'}}
				onChange={SelectorImage}
			/>
			{printPopUp && !FAActive && <FAEnable popUp={setPopUp} btn={setFAActive}/>}
			{printPopUp && FAActive && <FADisable popUp={setPopUp} btn={setFAActive}/>}
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/profil")}>home</button>
			</div>
			<Menu/>
			<div className='profil'>
				<center>
					<Avatar
						className='avatar'
						src={selectedImage || profilePic || require("src/asset/default.jpg")}
						style={{width:'100px',height: '100px' }}
					/>
					<br />
					<button onClick={handleEditPicture}>Edit picture</button>
				</center>
				<div className='information'>
					<InputLabel htmlFor="component-simple">Nickname</InputLabel>
					<Input value={nickName}/>
					<br/><br/>

					<InputLabel htmlFor="component-simple">RealName</InputLabel>
					<Input value={realName}/>
					<br/><br/>

					<TextField
						label="Description"
						multiline rows={10}
						defaultValue={description}
						style={{width: '80%'}}
					/>
					<br/><br/>

					<div style={{width:'100%'}}>
						<button style={{marginLeft:'75%'}} >Save</button>
						<br/><br/>
					</div>

					Two factor authentification :<br/>
					<FormControlLabel
						control={<Switch/>} 
						label={FAActive?"activer":"désactiver"}
						checked={FAActive}
						onChange={handleToggleFA}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditProfil;

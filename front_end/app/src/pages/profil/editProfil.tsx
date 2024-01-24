import React, { useEffect, useState } from 'react';
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
import { BACKEND_URL } from '../global/env';
import { userId } from '../global/userId';

const EditProfil: React.FC = () => 
{
	const navigate = useNavigate();
	const [realName, setRealName] = useState("Default");
	const [userName, setUserName] = useState("Default");
	const [description, setDescription] = useState("")
	const [printPopUp, setPopUp] = useState<boolean>(false);
	const [FAActive, setFAActive] = useState<boolean>(ReadCookie("TfaEnable") === "true");
	const [profilePic, setProfilePic] = useState(require("src/asset/default.jpg"));
	const [newProfilePic, setNewProfilePic] = useState<string | null>(null);

	const SelectorImage = (event: any) => 
	{
		const file = event.target.files?.[0];
		setNewProfilePic(event.target.files[0]);
		if (file)
		{
			const imageUrl = URL.createObjectURL(file);
			setProfilePic(imageUrl);
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

	const handle_submit = (e: any) => {
		e.preventDefault();
		
		axios.post(BACKEND_URL + "/user/update/description", { description }, { withCredentials: true })
			.then( (res : any) => {})
			.catch( (e) => {console.log(e.request); console.log(e.response)} );
		
		axios.post(BACKEND_URL + "/user/update/username", { username: userName }, { withCredentials: true })
			.then( (res : any) => {})
			.catch( (e) => {console.log(e)} );

		if (newProfilePic)
		{
			axios.postForm(BACKEND_URL + "/user/upload/avatar", {
				headers: {
						'Content-Type': 'multipart/form-data'
			  	},
		   		"avatar": newProfilePic }, { withCredentials: true })
			.then( (res: any) => {})
			.catch( (e) => console.log(e.request))
		}

		navigate("/profil/edit-Profil");
	}

	useEffect(() => {
		axios.get(BACKEND_URL + "/user/profile/edit", {withCredentials: true})
		.then(function (response)
		{
			setRealName(response.data.realname);
			setUserName(response.data.username);
			
			setFAActive(response.data.isTwoFAEnable);
			if (response.data.description === null)
				setDescription("");
			else
				setDescription(response.data.description);
			
			setProfilePic(BACKEND_URL + `/user/image/${userId}`);
		}).catch(err => {
			console.log(err);
		})
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
				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
			</div>
			<Menu/>
			<div className='profil'>
				<form onSubmit={handle_submit} id="editprofilform">
					<center>
						<Avatar
							className='avatar'
							src={profilePic || require("src/asset/default.jpg")}
							style={{width:'100px',height: '100px' }}
							/>
						<br />
						<button type="button" onClick={handleEditPicture}>Edit picture</button>
					</center>
					<div className='information'>
						<InputLabel htmlFor="component-simple">Nickname</InputLabel>
						<Input
							value={userName}
							onChange={function (e: any) {setUserName(e.target.value)}}
							/>
						<br/><br/>

						<InputLabel htmlFor="component-simple">RealName</InputLabel>
						{realName}
						<br/><br/>

						<TextField
							label="Description"
							multiline rows={10}
							value={description}
							style={{width: '80%'}}
							onChange={function (e: any) { setDescription(e.target.value) }}
							/>
						<br/><br/>

						Two factor authentification :<br/>
						<FormControlLabel
							id='form2Auth'
							control={<Switch/>} 
							label={FAActive?"activer":"désactiver"}
							checked={FAActive}
							onChange={handleToggleFA}
							/>

						<div style={{width:'100%'}}>
							<button style={{marginLeft:'75%'}} type="submit">Save</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfil;

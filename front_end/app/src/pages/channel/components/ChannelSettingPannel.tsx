import { Avatar, Box, List, ListItem } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "src/pages/global/env";


const ChannelSettingPanel = ({ channelId, hideOverlay }: { channelId: number, hideOverlay: any }) => {
	const [name, setName] = useState('');
	const [mode, setMode] = useState('PUBLIC');
	const [password, setPassword] = useState('');
	const [bannedPeople, setBannedPeople] = useState([])
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const [infoChanged, setInfoChanged] = useState<boolean>(false)

	const [file, setFile] = useState(null)
	const [errorBadgeMessage, setErrorBadgeMessage] = useState<null | string>(null)

	useEffect(() => {
		axios.get(BACKEND_URL + "/channel/info/" + channelId, { withCredentials: true })
			.then((res) => {
				setName(res.data.channelName)
				setMode(res.data.mode)
				setBannedPeople(res.data.banned)
			})
			.catch((e) => { console.log(e) })
	}, [channelId])

	useEffect(() => {
		const listener = (e: any) => {
			if (e.key === 'Escape') {
				hideOverlay()
			}
		}

		window.addEventListener('keydown', listener)

		return () => {
			window.removeEventListener('keydown', listener)
		}
	}, [channelId, hideOverlay])


	const infoChange = () => {
		setInfoChanged(true)
		setErrorMessage(null)
	}
	const handleNameChange = (e: any) => {
		setName(e.target.value);
		infoChange()
	};
	const handleModeChange = (e: any) => {
		setMode(e.target.value);
		infoChange()
	};
	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
		infoChange()
	};
	const handlePasswordConfirmChange = (e: any) => {
		setPasswordConfirm(e.target.value);
		infoChange()
	};
	const handleSubmit = (e: any) => {
		e.preventDefault()
		if (!infoChanged)
			return
		axios.post(BACKEND_URL + '/channel/update/' + channelId,
			{ name, password, passwordConfirm, mode },
			{ withCredentials: true })
			.then((res: any) => {
				setErrorMessage('success')
				setInfoChanged(false)
			})
			.catch((e) => setErrorMessage(e.response.data.message))
	}

	const handleFileChange = (e: any) => {
		setErrorBadgeMessage(null)
		setFile(e.target.files[0])
	}
	const submitFile = (e: any) => {
		e.preventDefault()
		if (file)
			axios.postForm(BACKEND_URL + '/channel/upload/badge/' + channelId,
				{ 'badge': file },
				{ withCredentials: true })
				.then(() => { setErrorBadgeMessage("badge upload success") })
				.catch((e) => setErrorBadgeMessage(e.response.data.message))
	}

	return (
		<div className='channel-form'>
			<form onSubmit={handleSubmit} >
				<label>
					Name:
					<input type="text" value={name} onChange={handleNameChange} />
				</label>
				<label>
					Mode:
					<select value={mode} onChange={handleModeChange}>
						<option value="PUBLIC">PUBLIC</option>
						<option value="PROTECTED">PROTECTED</option>
						<option value="PRIVATE">PRIVATE</option>
					</select>
				</label>
				{mode === 'PROTECTED' && (
					<div>
						<label>
							Password:
							<input type="password" value={password} onChange={handlePasswordChange} />
						</label>

						<label>
							Confirm password:
							<input
								type="password"
								value={passwordConfirm}
								onChange={handlePasswordConfirmChange}
							/>
						</label>
					</div>
				)}
				<button type="submit" className={infoChanged ? 'channel-form-button' : 'channel-form-button button-non-ready'}>
					Update
				</button><br></br>
				{errorMessage && <><span>{errorMessage}</span><br /></>}
			</form>
			<div className='channel-form-separator'></div>
			<form onSubmit={submitFile}>
				<label>
					Badge:
					<input type="file" onChange={handleFileChange} />
				</label>
				<button type="submit" className={file ? 'channel-form-button' : 'channel-form-button button-non-ready'}>
					Update Badge
				</button><br></br>
				{errorBadgeMessage && <><span>{errorBadgeMessage}</span><br /></>}
			</form>
			<button onClick={hideOverlay} className='channel-update-close-button channel-form-button' >Close</button>
			<div className='channel-form-separator'></div>
			{
				!!bannedPeople.length &&
				<List sx={{overflowY: 'auto', height: '180px'}}>
					{bannedPeople.map((banned, index) => (
						<Banned banned={banned} index={index} />
					))}
				</List>
			}
		</div>
	);
}


const Banned = ({ banned }: any) => {

	const [unbanSucces, setUnbanSuccess] = useState(false)


	const unban = (banned: any) => {
		axios.post(BACKEND_URL + '/channel/unban/' + banned.channelId + '/' + banned.id,
			{},
			{ withCredentials: true })
			.then((res) => setUnbanSuccess(true))
			.catch((err) => {
				console.log(err)
			})
	}


	return (
		<ListItem key={banned.userId} >
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<Avatar
					src={BACKEND_URL + "/user/image/" + banned.userId}
					alt={banned.username}
					sx={{ width: 60, height: 60 }}
				/>
				<h1 className="margin-bottom-0px" >{banned.username}</h1>
				{!unbanSucces && <button onClick={() => unban(banned)} className="channel-form-button">Unban</button>}
				{unbanSucces && <div>Unbanned</div>}
			</Box>
		</ListItem>
	)
}




export default ChannelSettingPanel;
import React, { useEffect, useState } from 'react';

import ChannelList from 'src/components/channelList';
import '../../css/channel.css';
import { BACKEND_URL } from '../global/env';
import axios from 'axios';
import { Input } from '@mui/material';
import { useNavigate } from 'react-router';


const Channel = ({ channel, popChannel }: any) => {

	const navigate = useNavigate()

	const [password, setPassword] = useState('')
	const [showPasswordoverlay, setshowPasswordoverlay] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

	const showOverLay = () => {
		setPasswordMessage(null)
		setshowPasswordoverlay(true)
	}

	const hideOverLay = (e?: any) => {
		e?.stopPropagation()
		setPasswordMessage(null)
		setshowPasswordoverlay(false)
		setShowPassword(false)
	}

	const joinPublic = () => {
		axios.post(BACKEND_URL + '/channel/join/public', { channelId: channel.id }, { withCredentials: true })
			.then(() => navigate("/channel/" + channel.id))
			.catch((e) => console.log(e.response.data))
	}

	const joinChannel = () => {
		if (channel.mode === "PUBLIC")
			joinPublic()
		if (channel.mode === "PROTECTED") {
			showOverLay()
		}
	}

	const handlepasswordChange = (e: any) => {
		setPassword(e.target.value)
	}

	const handleKeyDown = (e: any) => {
		if (e.key === 'Escape')
			hideOverLay()
		if (e.key === 'Enter')
			passwordSubmit()
	}

	const passwordSubmit = () => {
		setPasswordMessage(null)
		axios.post(BACKEND_URL + "/channel/join/protected",
			{ channelId: channel.id, password },
			{ withCredentials: true })
			.then(() => navigate("/channel/" + channel.id))
			.catch((e) => setPasswordMessage(e.response.data.message))
	}

	return (
		<div className="channel-box" onClick={joinChannel}>
			{showPasswordoverlay && <div className='channel-password-overlay'>
				<div className='channel-password-wrap' >
					{passwordMessage ? <div className='password-submit-message'>{passwordMessage}</div> : null}
					<Input
						autoFocus={true}
						className="channel-password-input"
						placeholder="password..."
						type={showPassword ? "text" : "password"}
						onChange={handlepasswordChange}
						onKeyDown={handleKeyDown} />
				</div>
				<button
					className="channel-password-button"
					onClick={hideOverLay}>Cancel</button>
				<button
					className="channel-password-button"
					onClick={passwordSubmit}>Submit</button>
				<div
					className="channel-show-password-button"
					onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</div>
			</div>}
			<div className="owner">
				<img
					className="ownerimg"
					src={BACKEND_URL + '/channel/badge/' + channel.id} />
			</div>
			<div className='channelInfo'>
				<p className='channelName'>
					{channel.channelName}
				</p>
				<p className='channelMode'>
					{channel.mode}
				</p>
				<p className='channelMode'>
					{channel.members} {channel.members === 1 ? "member" : "members"}
				</p>
			</div>
		</div>
	);
};

const CreateChannel = () => {
	const [name, setName] = useState('');
	const [mode, setMode] = useState('PUBLIC');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [file, setFile] = useState(null)
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const [badgeUpload, setbadgeUpload] = useState<null | string>(null)
	const [channelMessage, setchannelMessage] = useState<null | string>(null)

	const handleNameChange = (e: any) => {
		setName(e.target.value);
	};

	const handleModeChange = (e: any) => {
		setErrorMessage(null)
		setchannelMessage(null)
		setbadgeUpload(null)
		setMode(e.target.value);
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handlePasswordConfirmChange = (e: any) => {
		setPasswordConfirm(e.target.value);
	};

	const handleFileChange = (e: any) => {
		setFile(e.target.files[0])
	}

	const handleSubmit = (e: any) => {
		e.preventDefault()
		setErrorMessage(null)
		setchannelMessage(null)
		setbadgeUpload(null)

		axios.post(BACKEND_URL + '/channel',
			{ name, password, passwordConfirm, mode },
			{ withCredentials: true })
			.then((res: any) => {
				setchannelMessage('channel Created')
				if (file)
					axios.postForm(BACKEND_URL + '/channel/upload/badge/' + res.data.channelId,
						{ 'badge': file },
						{ withCredentials: true })
						.then(() => setbadgeUpload('badge upload success'))
						.catch((e) => setErrorMessage(e.response.data.message))
			})
			.catch((e) => setErrorMessage(e.response.data.message))
	}

	return (
		<div className='channel-form'>
			<form onSubmit={handleSubmit} >
				<div>
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
					<label>
						Badge:
						<input type="file" onChange={handleFileChange} />
					</label>
					<button type="submit" className='button'>Create</button><br></br>
					{errorMessage && <><span>{errorMessage}</span><br /></>}
					{channelMessage && <><span>{channelMessage}</span><br /></>}
					{badgeUpload && <span>{badgeUpload}</span>}
				</div>
			</form>
		</div>
	);
};

interface ChannelProps {
	channelName: string
	mode: "PUBLIC" | "PROTECTED"
	id: number
	ownerId: number
	ownerUsername: string
	members: number
}

const Channels: React.FC = () => {
	const [channelList, setChannelList] = useState<ChannelProps[]>([])

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel/list', { withCredentials: true })
			.then((res): any => {
				setChannelList(res.data)
			})
			.catch(error => console.log(error))
	}, [])

	const popChannel = (channelId: number) => {
		const channels = new Array()
		for (const channel of channelList) {
			if (channel.id !== channelId)
				channels.push(channel)
		}
		setChannelList(channels)
	}

	return (
		<>
			<ChannelList />
			<div className="channel-content-wrapper">
				<CreateChannel />
				<div className='channel-box-wrapper'>
					{
						Object.keys(channelList).map((i) => (
							<Channel key={i} channel={channelList[i]} popChannel={popChannel} />
						))
					}
				</div>
			</div>
		</>
	);
};

export default Channels;
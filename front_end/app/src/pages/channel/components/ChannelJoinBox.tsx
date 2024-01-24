import { Input } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { BACKEND_URL } from 'src/pages/global/env';
import { ChannelProps } from '../types/ChannelProps.types';
import { errorHandler } from 'src/context/errorHandler';
import { useErrorContext } from 'src/context/ErrorContext';


const ChannelJoinBox = ({ channel, onUpdate }: { channel: ChannelProps, onUpdate: any }) => {

	const navigate = useNavigate()

	const [password, setPassword] = useState('')
	const [showPasswordoverlay, setshowPasswordoverlay] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
	const errorContext = useErrorContext();

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
			.then(() => { onUpdate(); navigate("/chat/channel/" + channel.id) })
			.catch((e) => {
				errorContext.newError?.(errorHandler(e))
			})
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
			.then(() => { onUpdate(); navigate("/chat/channel/" + channel.id) })
			.catch((e) => {
				setPasswordMessage(e.response.data.message)
			})
	}

	return (
		<div className="channel-box" onClick={joinChannel}>
			{showPasswordoverlay && <div className='channel-password-overlay'>
				<div className='channel-password-wrap' >
					{passwordMessage ? <div className='password-submit-message red'>{passwordMessage}</div> : null}
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
					alt={channel.channelName + " badge"}
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

export default ChannelJoinBox;
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { BACKEND_URL } from "src/pages/global/env";
import { socket } from "src/pages/global/websocket";


const ChannelTopBar = ({ channelId }: { channelId: number }) => {

	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [imageKey, setImageKey] = useState(0);

	const errorContext = useErrorContext();

	useEffect(() => {
		axios.get(BACKEND_URL + "/channel/info/" + channelId, { withCredentials: true })
			.then((res) => {
				setName(res.data.channelName)
			})
			.catch((e) => { errorContext.newError?.(errorHandler(e)); })
	}, [channelId, errorContext])

	useEffect(() => {
		const listenNewBadge = (info: { channelId: number }) => {
			if (channelId === info.channelId)
				setImageKey(prev => prev + 1)
		}

		const listenNewInfo = (info: { channelName: string, mode: string, channelId: number }) => {
			if (channelId === info.channelId)
				setName(info.channelName)
		}

		socket?.on('new-channel-badge', listenNewBadge)
		socket?.on('new-channel-info', listenNewInfo)

		return () => {
			socket?.off('new-channel-badge', listenNewBadge)
			socket?.off('new-channel-info', listenNewInfo)
		}

	}, [channelId])

	return (
		<div className='channel-top-bar'>
			<img
				className='channel-top-bar-img'
				alt={name + " channel badge"}
				src={BACKEND_URL + '/channel/badge/' + channelId + `?${imageKey}`} />
			<div className='channel-top-bar-name'>{name}</div>
			<div className="header">
			<div className="margin-cu"><button className="btn btn-light" onClick={() => navigate("/")}>home</button> </div>
			</div>
		</div>
	);
}

export default ChannelTopBar;
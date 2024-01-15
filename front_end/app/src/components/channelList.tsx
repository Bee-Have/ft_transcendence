import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { userId } from 'src/pages/global/userId';
// import '../css/chat.css';
import { BACKEND_URL } from 'src/pages/global/env';
// import '../css/channel.css';
import { userId } from 'src/pages/global/userId';
import '../css/channel.css';

const Channel = ({ channel, selectedId }: { channel: ChannelProps, selectedId: number }) => {

	const navigate = useNavigate()

	return (
		<li
			className="channel-bar-button"
			onClick={() => { navigate("/channel/" + channel.id) }}>
			<img
				src={BACKEND_URL + '/channel/badge/' + channel.id}
				alt={channel.name}
				className={ selectedId === channel.id ? "channel-badge selected": "channel-badge"}
			/>
			<div className="channel-show-name">{channel.name}</div>
		</li>
	)
}

const Home = ({ navigate }: any) => {
	return (
		<li
			className="channel-bar-button"
			onClick={() => { navigate("/chat") }}>
			<img
				src={BACKEND_URL + '/user/image/' + userId}
				alt={userId + " image"}
				className="channel-badge"
			/>
			<div className="channel-show-name">Chat</div>
		</li>
	)
}

interface ChannelProps {
	name: string
	mode: "PUBLIC" | "PRIVATE" | "PROTECTED"
	id: number
	role: "NONADMIN" | "OWNER" | "ADMIN"
	ownerId: number
}

const ChannelList: React.FC = () => {
	const [channels, setChannels] = useState<ChannelProps[]>([])
	const navigate = useNavigate()
	const [selectedChannelId, setSelectedChannelId] = useState<number>(-1)

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel', { withCredentials: true })
			.then((res: any) => {
				setChannels(res.data)
			})
			.catch((e) => console.log(e))
	}, [])

	console.log(window.location.pathname)

	useEffect(()=> {
		const id = window.location.pathname.split('/')
		if (id[2]){
			const i = Number(id[2])
			if (!isNaN(i))
				setSelectedChannelId(i)
			else
				setSelectedChannelId(-1)
		}

	}, [window.location.pathname, selectedChannelId])

	return (
		<nav className='channel-list-bar'>
			<div className="channel-list-bar-ul">
				<Home navigate={navigate} />
				<div className="separator"></div>
				{
					Object.keys(channels).map((index) => (
						<Channel key={index} channel={channels[index]} selectedId={selectedChannelId} />
					))
				}
				<li
					className="channel-bar-button"
					onClick={() => { navigate("/channel") }}>
					<AddCircleOutlineIcon className="channel-badge channel-add-cross" />
					<div className="channel-show-name">Create/Add</div>
				</li>
			</div>
		</nav>
	);
};

export default ChannelList;
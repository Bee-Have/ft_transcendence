import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userId } from 'src/pages/global/userId';
import '../css/chat.css';
import { BACKEND_URL } from 'src/pages/global/env';


interface CardProps {
	photo: string;
}

const GroupPicture: React.FC<CardProps> = ({ photo }) => {
	return (
		<div className="PP">
			<img src={photo} alt={'test'} className="group-image" />
		</div>
	);
};

const Channel = ({ channel }: any) => {

	const navigate = useNavigate()

	const [isHover, setIsHover] = useState(false)

	const handleMouseOver = () => {
		setIsHover(true);
	};

	const handleMouseOut = () => {
		setIsHover(false);
	};

	return (
		<Button
			className="PP"
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			onClick={() => { navigate("/channel/" + channel.id) }}>
			<img
				src={BACKEND_URL + '/user/image/' + channel.ownerId}
				alt={'test'}
				className="group-image"
			/>
			{isHover && <div className="channel-show-name">{channel.name}</div>}
		</Button>
	)

}

const ChannelList: React.FC = () => {
	const [channels, setChannels] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel', {withCredentials: true})
			.then((res: any) => {
				setChannels(res.data)
				console.log(res.data)
			})
			.catch((e) => console.log(e))
	}, [])


	return (
		<div className="channelList">
			<center>
				<GroupPicture photo={BACKEND_URL + '/user/image/' + userId} />
				<div className="separator"></div>
				{
					Object.keys(channels).map((index) => (
						<Channel key={index} channel={channels[index]} />
					))
				}
				<Button onClick={() => navigate('/channel')}> <AddCircleOutlineIcon style={{ fontSize: '4em' }} className='add' /> </Button>
			</center>
		</div>
	);
};

export default ChannelList;
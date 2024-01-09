import React, { useEffect, useState } from 'react';

import Menu from '../../components/menu';
import axios from 'axios';
import '../../css/channel.css';


const Channel = ({ channel }: any) => {

	console.log(channel.mode)

	return (
		<div className="channel-box">
			<div className="owner">
				<img className="ownerimg" src={"http://localhost:3001/user/image/" + channel.ownerId} />
				<p className='ownerUsername'>{channel.ownerUsername}</p>
			</div>
			<div className='channelInfo'>
				<p className='channelName'>{channel.channelName}</p>
				<p className='channelMode'>{channel.mode}</p>
			</div>
		</div>
	);
};


const Channels: React.FC = () => {
	const [channelList, setChannelList] = useState([])

	useEffect(() => {
		axios.get('http://localhost:3001/channel/list')
			.then((res): any => {
				setChannelList(res.data)
			})
			.catch(error => console.log(error))
	}, [])

	return (
		<div className='pending'>
			<Menu />
			<div className='content'>
				<div className='printCard'>
					{
						Object.keys(channelList).map((i) => (
							<Channel key={i} channel={channelList[i]} />
						))
					}
				</div>
			</div>
		</div>
	);
};

export default Channels;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../global/env';
import ChannelCreationForm from './components/ChannelCreationForm';
import ChannelJoinBox from './components/ChannelJoinBox';
import { ChannelProps } from './types/ChannelProps.types';

import '../../css/channel.css';
import '../../css/chat.css';
import { errorHandler } from 'src/context/errorHandler';
import { useErrorContext } from 'src/context/ErrorContext';

const ChannelJoiningList = ({ onUpdate }: any) => {
	const [channelList, setChannelList] = useState<ChannelProps[]>([])
	const errorContext = useErrorContext();

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel/list', { withCredentials: true })
			.then((res): any => {
				setChannelList(res.data)
			})
			.catch(e => errorContext.newError?.(errorHandler(e)))
	}, [errorContext])

	// const popChannel = (channelId: number) => {
	// 	setChannelList((prev => channelList.filter(
	// 		(channel) => { return channel.id !== channelId })))
	// }

	return (
		<div className="channel-content-wrapper">
			<ChannelCreationForm onUpdate={onUpdate} />
			<div className='channel-box-wrapper'>
				{
					Object.keys(channelList).map((i) => (
						<ChannelJoinBox key={i} channel={channelList[i]} onUpdate={onUpdate} />
					))
				}
			</div>
		</div>
	);
};

export default ChannelJoiningList;
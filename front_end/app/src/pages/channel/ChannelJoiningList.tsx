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
import { AxiosError } from "axios";

const ChannelJoiningList = ({ onUpdate }: any) => {
	const [channelList, setChannelList] = useState<ChannelProps[]>([])
	const errorContext = useErrorContext();
	const [updateList, setUpdateList] = useState<boolean>(false)
	const [updateMessage, setUpdateMessage] = useState<string | null>(null)

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel/list', { withCredentials: true })
			.then((res: any) => {
				setChannelList(res.data)
				setUpdateMessage('Up to date')
			})
			.catch((e: Error | AxiosError<unknown, any>) => errorContext.newError?.(errorHandler(e)))
	}, [updateList, errorContext])

	const updateChannelList = () => {
		setUpdateMessage(null)
		setUpdateList((r: boolean) => !r)
	}

	return (
		<div className="channel-content-wrapper">
			<ChannelCreationForm onUpdate={onUpdate} />
			<div className='channel-box-wrapper'>
				<div className='channel-reload-button-wrapper'>
					<button className='channel-form-button' onClick={updateChannelList}>Reload</button>
					{updateMessage && <div className='password-submit-message white bc-green'>{updateMessage}</div>}
				</div>
				{
					Object.keys(channelList).map((i) => (
						<ChannelJoinBox key={i} channel={channelList[parseInt(i)]} onUpdate={onUpdate} />
					))
				}
			</div>
		</div>
	);
};

export default ChannelJoiningList;
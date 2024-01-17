import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelTextArea from 'src/components/channel.text-area';
import { BACKEND_URL } from '../global/env';
import ChannelMembersBar from './components/ChannelMembersBar';
import ChannelTopBar from './components/ChannelTopBar';
import { MemberProps } from './types/MemberProps.types';

import '../../css/channel.css';
import '../../css/chat.css';

const Channel: React.FC = () => {

	const { id } = useParams()
	const [channelMembers, setChannelMembers] = useState<MemberProps[]>([])
	const navigate = useNavigate()
	const channelId = Number(id)

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel/members/' + channelId, { withCredentials: true })
			.then((res): any => {
				setChannelMembers(res.data)
			})
			.catch((e: any) => {
				console.log(e)
				navigate("/" + e.response.status)
			})
	}, [channelId, navigate])

	return (
		<div className="channel-content-wrapper">
			<ChannelTopBar
				channelId={channelId} />
			<ChannelMembersBar
				channelMembers={channelMembers}
				channelId={channelId} />
			<ChannelTextArea currentChannelId={Number(id)} />
		</div>
	);
};

export default Channel;
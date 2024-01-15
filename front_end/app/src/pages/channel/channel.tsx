import { Avatar, List, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelTextArea from 'src/components/channel.text-area';
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import axios from 'axios';
import '../../css/channel.css';
import { BACKEND_URL } from '../global/env';
import { userId } from '../global/userId';

interface MemberProps {
	userId: number,
	memberId: number,
	role: string,
	state: string,
	channelId: string,
	username: string,
	channelName: string
}

const ChannelMembers = ({ channelId }: { channelId: number }) => {

	const [channelMembers, setChannelMembers] = useState<MemberProps[]>([])

	const navigate = useNavigate()

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
		<>
			<div className=''>{channelMembers[0]?.channelName}</div>
			<List>
				<div className="" >
					{channelMembers.map((member, index) => (
						<ListItemButton key={index} >
							<Avatar
								className=""
								alt={member.username}
								src={BACKEND_URL + '/user/image/' + member.userId}
								sx={{ width: 60, height: 60 }} />
							<div className="">{member.username}<span className=''>{member.role === "NONADMIN" ? "VILLAGERS" : member.role}</span></div>
						</ListItemButton>
					))}

				</div>
			</List>
		</>
	)

}

const Channel: React.FC = () => {

	const { id } = useParams()

	return (
		<div className="channel-content-wrapper">
			<ChannelMembers channelId={Number(id)} />
			<ChannelTextArea currentChannelId={Number(id)} userId={userId} />
		</div>
	);
};

export default Channel;
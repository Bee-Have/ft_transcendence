import { Avatar, List, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelTextArea from 'src/components/channel.text-area';
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import axios from 'axios';
import ChannelList from 'src/components/channelList';
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

	useEffect(() => {
		axios.get('http://localhost:3001/channel/members/' + userId + "/" + channelId)
			.then((res): any => {
				setChannelMembers(res.data)
			})
			.catch(e => console.log(e))
	}, [channelId])

	return (
		<>
		<div className='channelName'>{channelMembers[0]?.channelName}</div>
		<List>
			<div className="friend" >
				{channelMembers.map((member, index) => (
					<ListItemButton key={index} >
						<Avatar
							className="avatar"
							alt={member.username}
							src={'http://localhost:3001/user/image/' + member.userId}
							sx={{width: 60, height: 60}} />
						<div className="name">{member.username}<span className='role'>{member.role === "NONADMIN" ? "VILLAGERS" : member.role }</span></div>
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
		<div className="chat">
			<ChannelList />
			<div className="channelPeople">
				<ChannelMembers channelId={Number(id)} />
				<ChannelTextArea currentChannelId={Number(id)} userId={userId} />
			</div>
		</div>
	);
};

export default Channel;
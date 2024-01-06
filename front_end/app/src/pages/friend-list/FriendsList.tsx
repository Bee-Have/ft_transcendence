// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PopUp from '../../components/popUp';
import Menu from '../../components/menu';
import { Friend } from '../global/friend.dto';
// import { userId } from '../global/userId';
import { socket } from '../global/websocket';

import { Avatar } from "@mui/material";

interface CardProps {
	photo: string;
	name: string;
	onClick: (name: string, event: React.MouseEvent<HTMLDivElement>) => void;
	status: string
}

const Card: React.FC<CardProps> = ({ photo, name, onClick, status }) => {
	return (
		<div className="card" onClick={(event) => onClick(name, event)}>
			<div className="PP">
				{/* <img src={photo} alt={'test'} className="person-image" /> */}
				<Avatar src={photo} sx={{ width: 60, height: 60 }} />
			</div>
			<div className='name'>
				<h1>{name}<br/>{status}</h1>
			</div>
		</div>
	);
};

const FriendList: React.FC = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [popupContent, setPopupContent] = useState<Friend>({id: 0, username: '', status: ''});
	
	// const [showPopUp, setPopUp] = useState(false);
	// const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [friends, setFriends] = useState<Friend[]>([]) 


	const handleCardClick = (user: Friend, event: React.MouseEvent<HTMLDivElement>) => {
		setPopupContent(user);
		setAnchorEl(event.currentTarget);
		// const boundingBox = event.currentTarget.getBoundingClientRect();
		// if (boundingBox) {
		// 	const x = event.pageX;
		// 	const y = event.pageY;

		// 	setMousePosition({ x, y });
		// 	setPopupContent(name);
		// 	setPopUp(true);
		// }
	};

	useEffect(() => {
		// axios.get('http://localhost:3001/user/test/friend/' + userId, { withCredentials: true })
		// .then(res => setFriends(res.data))
		// .catch(err => console.log(err))
		setFriends(
			[
				{id : 1, username: 't', status: 'online'},
				{id : 2, username: '123456789', status: 'offline'},
				{id : 3, username: '123456789abcdef', status: 'online'},
				{id : 4, username: 'pasteque', status: 'offline'},
				{id : 5, username: 'test5', status: 'playing'}
			]
		);
	}, [])

	useEffect(() => {
		const listenNewStatus = (status: any) => {
			const updatedFriends = friends.map(friend => friend.id === status.userId ? {...friend, status: status.status} : friend)
			setFriends(updatedFriends)
		}

		socket?.on('user-status', listenNewStatus)
		
		return () => {
			socket?.off('user-status', listenNewStatus)
		}
	}, [friends])

	return (
		<div className="friendList">
			<Menu />
			<div className="content">
				<div className="printCard">
					{Object.keys(friends).map((i) => (
						<Card 
							key={i}
							photo={'http://localhost:3001/user/image/' + friends[i].id}
							name={friends[i].username}
							onClick={(name, event) => handleCardClick(friends[i], event)}
							status={friends[i].status}/>
					))}
				</div>
			</div>
			{<PopUp
				user={popupContent}
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
			/>}
		</div>
	);
};

export default FriendList;
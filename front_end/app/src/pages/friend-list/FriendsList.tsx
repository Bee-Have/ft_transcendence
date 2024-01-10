import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PopUp from '../../components/popUp';
import Menu from '../../components/menu';
import { Friend } from '../global/friend.dto';
import { socket } from '../global/websocket';
import { BACKEND_URL } from '../global/env';

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
				<img src={photo} alt={'test'} className="person-image" />
			</div>
			<div className='name'>
				<h1>{name}<br/>{status}</h1>
			</div>
		</div>
	);
};

const FriendList: React.FC = () => {
	const [showPopUp, setPopUp] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [popupContent, setPopupContent] = useState('');
	const [friends, setFriends] = useState<Friend[]>([]) 


	const handleCardClick = (name: string, event: React.MouseEvent<HTMLDivElement>) => {
		const boundingBox = event.currentTarget.getBoundingClientRect();
		if (boundingBox) {
			const x = event.pageX;
			const y = event.pageY;

			setMousePosition({ x, y });
			setPopupContent(name);
			setPopUp(true);
		}
	};

	useEffect(() => {
		axios.get(BACKEND_URL + '/user/friends', { withCredentials: true })
		.then(res => setFriends(res.data))
		.catch(err => console.log(err))
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
							photo={BACKEND_URL + '/user/image/' + friends[i].id}
							name={friends[i].username}
							onClick={handleCardClick}
							status={friends[i].status}/>
					))}
				</div>
			</div>
			{showPopUp && <PopUp x={mousePosition.x} y={mousePosition.y} user={popupContent} />}
		</div>
	);
};

export default FriendList;
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FriendRequest } from './global/friend.dto';
import { userId } from './global/userId';


const Card = ({ request }: any) => {

	const [message, setMessage] = useState<string | null>(null)
	const [hideBlock, setHideBlock] = useState(false)

	const handleAcceptFrRq = () => {
		axios.post('http://localhost:3001/user/friend/accept/' + userId + '/' + request.id)
			.then(() => setMessage('accepted'))
			.catch(e => console.log(e))
	}

	const handleReject = () => {
		axios.post('http://localhost:3001/user/friend/reject/' + userId + '/' + request.id)
		.then(() => setMessage('rejected'))
		.catch(e => console.log(e))
	}

	const handleBlock = () => {
		axios.post('http://localhost:3001/user/friend/block/' + userId, { blockedUserId: request.id })
		.then(() => setHideBlock(true))
		.catch((e) => {
			console.log(e)
			setHideBlock(true)
		})
	}

	return (
		<div className="card">
			<div className="PP">
				<img src={"http://localhost:3001/user/image/" + request.id} alt={'test'} className="person-image" />
			</div>
			<div className='name'>
				<h1>{request.username}</h1>
			</div>

			{message ? <p color='red'>{message}</p> : (
				<>
					<a href="#" className="round-button" onClick={handleAcceptFrRq}>
						<CheckCircleOutlineIcon className='acceptBtn' style={{ fontSize: '2em' }} />
					</a>
					<a href="#" className="round-button">
						<BlockIcon className="refuseBtn" style={{ fontSize: '2em' }} onClick={handleReject} />
					</a>
					{ hideBlock ? "" : <a href="#" className="round-button">
						<LockIcon className="blockBtn" style={{ fontSize: '2em' }} onClick={handleBlock} />
					</a>}
				</>)
			}

		</div>
	);
};


const Pending: React.FC = () => {
	const [friendsReq, setFriendsReq] = useState<FriendRequest[]>([])

	useEffect(() => {
		axios.get('http://localhost:3001/user/pending/' + userId, { withCredentials: true })
			.then(res => setFriendsReq(res.data))
			.catch(e => console.log(e))
	}, [])


	return (
		<div className="pending">
			<div className="content">
				<div className="printCard">
					{Object.keys(friendsReq).map((i) => (
						<Card request={friendsReq[i]} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Pending;
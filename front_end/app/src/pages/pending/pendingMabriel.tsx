import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FriendRequest } from '../global/friend.dto';

import Menu from '../../components/menu';
import { BACKEND_URL } from '../global/env';

const Card = ({ request }: any) => {

	const [message, setMessage] = useState<string | null>(null)
	const [hideBlock, setHideBlock] = useState(false)

	const handleAcceptFrRq = () => {
		axios.post(BACKEND_URL + '/user/friend/accept/' + request.id, {}, { withCredentials: true })
			.then(() => setMessage('accepted'))
			.catch(e => console.log(e))
	}

	const handleReject = () => {
		axios.post(BACKEND_URL + '/user/friend/reject/' + request.id, {}, { withCredentials: true })
		.then(() => setMessage('rejected'))
		.catch(e => console.log(e))
	}

	const handleBlock = () => {
		axios.post(BACKEND_URL + '/user/friend/block/' + request.id, {}, { withCredentials: true })
		.then(() => setHideBlock(true))
		.catch((e) => {
			console.log(e)
			setHideBlock(true)
		})
	}

	return (
		<div className="card">
			<div className="PP">
				<img src={BACKEND_URL + '/user/image/' + request.id} alt={'test'} className="person-image" />
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
		axios.get(BACKEND_URL + '/user/pending/', { withCredentials: true })
			.then(res => setFriendsReq(res.data))
			.catch(e => console.log(e))
	}, [])


	return (
		<div className="pending">
			<Menu />
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
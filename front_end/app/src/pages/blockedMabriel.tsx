import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { userId } from './global/userId';
import axios from 'axios';
//import test from '../asset/default.jpg'

const Card = ({ prop }: any) => {

	const [message, setMessage] = useState<string | null>(null)

	const handleUnblock = () => {
		axios.post('http://localhost:3001/user/friend/unblock/' + userId, { blockedUserId: prop.id }, { withCredentials: true })
		.then(() => setMessage('Unblocked'))
		.catch((e) => console.log(e))
	}	

	return (
		<div className="card">
			<div className="PP">
				<img src={'http://localhost:3001/user/image/' + prop.id} alt="test" className="person-image" />
			</div>
			<div className="name">
				<h1>{prop.username}</h1>
			</div>
			<div className="align-right">
				{
				message ? message : 
				<Button variant="contained" className="unblockBtn" onClick={handleUnblock}>Unblock</Button>
				}
			</div>
		</div>
	);
};

const Bloqued: React.FC = () => {

	const [blockedUser, setBlockedUser] = useState([])

	useEffect(() => {
		axios.get('http://localhost:3001/user/blocked/' + userId, { withCredentials: true })
			.then((res) => setBlockedUser(res.data))
			.catch((e) => console.log(e))
	}, [])

	return (
		<div className="bloqued">
			<div className="content">
				<div className="printCard">
					{Object.keys(blockedUser).map((i) => (
						<Card prop={blockedUser[i]} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Bloqued;
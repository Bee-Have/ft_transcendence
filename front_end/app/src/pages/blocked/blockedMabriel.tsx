import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
//import test from '../asset/default.jpg'

import Menu from '../../components/menu';
import { BACKEND_URL } from '../global/env';

const Card = ({ prop }: any) => {

	const [message, setMessage] = useState<string | null>(null)

	const handleUnblock = () => {
		axios.post(BACKEND_URL + '/user/friend/unblock/' + prop.id, {}, { withCredentials: true })
		.then(() => setMessage('Unblocked'))
		.catch((e) => console.log(e))
	}	

	return (
		<div className="card">
			<div className="PP">
				<img src={BACKEND_URL + '/user/image/' + prop.id} alt="test" className="person-image" />
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
		axios.get(BACKEND_URL + '/user/blocked', { withCredentials: true })
			.then((res) => setBlockedUser(res.data))
			.catch((e) => console.log(e))
	}, [])

	return (
		<div className="bloqued">
			<Menu />
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
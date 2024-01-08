import React from 'react';
import { useNavigate } from 'react-router-dom';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';

import Menu from '../components/menu';

interface CardProps {
	photo: string;
	text: string;
}

const Card: React.FC<CardProps> = ({ photo, text }) => {
	return (
		<div className="card">
			<div className="avatar">
				<center>
					<Avatar id="matchHistoryAvatar" src={require('../asset/default.jpg')}/>
				</center>
			</div>
			<div className='name'>
				<h1>{text}</h1>
			</div>
			<a href="#" className="round-button">
				<CheckCircleOutlineIcon className='acceptBtn' style={{fontSize:'2em'}} />
			</a>
			<a href="#" className="round-button">
				<BlockIcon className="refuseBtn" style={{fontSize:'2em'}}/>
			</a>
			<a href="#" className="round-button">
				<LockIcon className="blockBtn" style={{fontSize:'2em'}}/>
			</a>
		</div>
	);
};


const Pending: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="pending">
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
			</div>
			<Menu checker={3}/>
			<div className="content">
				<div className="printCard">
					<Card photo={'./asset/default.jpg'} text={'test1'} />
					<Card photo={'./asset/default.jpg'} text={'test2'} />
					<Card photo={'./asset/default.jpg'} text={'test3'} />
					<Card photo={'./asset/default.jpg'} text={'test4'} />
				</div>
			</div>
		</div>
	);
};

export default Pending;
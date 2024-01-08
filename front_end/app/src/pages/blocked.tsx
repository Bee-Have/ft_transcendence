import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import Menu from '../components/menu';

interface CardProps {
	text: string;
}

const Card: React.FC<CardProps> = ({text}) => { return (
		<div className="card">
			<div className="PP">
				<img src={require("../asset/default.jpg")} alt="test" className="person-image"/>
			</div>
			<div className="name">
				<h1>Test</h1>
			</div>
			<div className="align-right">
				<Button variant="contained" className="unblockBtn">Unblock</Button>
			</div>
		</div>
	);
};

const Blocked: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="blocked">
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
			</div>
			<Menu checker={4}/>
			<div className="content">
				<div className="printCard">
					<Card text={'test1'} />
					<Card text={'test2'} />
					<Card text={'test3'} />
					<Card text={'test4'} />
				</div>
			</div>
		</div>
	);
};

export default Blocked;
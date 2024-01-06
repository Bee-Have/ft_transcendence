import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';

import Menu from '../../components/menu';

interface CardProps {
  photo: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ photo, text }) => {
  return (
    <div className="card">
      <div className="PP">
        <img src={require('../asset/default.jpg')} alt={'test'} className="person-image" />
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
  return (
    <div className="pending">
      <Menu/>
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
import React from 'react';
import Button from '@mui/material/Button';
//import test from '../asset/default.jpg'

import Menu from '../../components/menu';

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
  return (
    <div className="blocked">
      <Menu/>
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
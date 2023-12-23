import React from 'react';
import Button from '@mui/material/Button';
//import test from '../asset/default.jpg'

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

export default Blocked;
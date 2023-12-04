import React from 'react';

interface CardProps {
  photo: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ photo, text}) => {
  return (
    <div className="card">
      <img src={require('../asset/default.jpg')} className="card"/>
    <p className="text">{text}</p>
    </div>  
  );
};

export default Card;
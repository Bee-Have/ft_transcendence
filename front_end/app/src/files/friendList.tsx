import React from 'react';

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
    </div>
  );
};

const FriendList: React.FC = () => {
  return (
    <div className="friendList">
      <div className="content">
        <div className="printCard">
          <Card photo={'./assset/default.jpg'} text={'test1'} />
          <Card photo={'./asset/default.jpg'} text={'test2'} />
          <Card photo={'./asset/default.jpg'} text={'test3'} />
          <Card photo={'./asset/default.jpg'} text={'test4'} />
        </div>
      </div>
    </div>
  );
};

export default FriendList;
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';

interface CardProps {
  photo: string;
  name: string;
}

const Friend: React.FC<CardProps> = ({ photo, name}) => {
  return (
    <div className="friend">
			<ListItem button>
      	<Avatar className='avatar' alt={name} src={require("../asset/default.jpg")}/>
				<div className='name'>
					{name}
				</div>
			</ListItem>
    </div>
  );
};

const ChannelPeople: React.FC = () => {
  return (
    <div className="channelPeople">
      <div className='privMsg'>
				Private message +
			</div>
			<List component="nav" aria-label="mailbox folders">
				<Friend photo={'../asset/default.jpg'} name={"test1"}/>
				<Friend photo={'../asset/default.jpg'} name={"test2"}/>
				<Friend photo={'./asset/default.jpg'} name={"test3"}/>
				<Friend photo={'./asset/default.jpg'} name={"test4"}/>
				<Friend photo={'./asset/default.jpg'} name={"test5"}/>
			</List>
    </div>
  );
};

export default ChannelPeople;
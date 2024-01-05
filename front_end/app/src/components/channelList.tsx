import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../css/chat.css';


interface CardProps {
	photo: string;
}

const GroupPicture: React.FC<CardProps> = ({photo}) => {
	return (
		<div className="PP">
			<img src={require("../asset/default.jpg")}  alt={'test'} className="group-image" />
		</div>
	);
};

const ChannelList: React.FC = () => {
	return (
		<div className="channelList">
			<center>
				<GroupPicture photo="../asset/default.jpg"/>
				<div className="separator"></div>
				<GroupPicture photo="../asset/default.jpg"/>
				<GroupPicture photo="../asset/default.jpg"/>
				<GroupPicture photo="../asset/default.jpg"/>
				<GroupPicture photo="../asset/default.jpg"/>
				<GroupPicture photo="../asset/default.jpg"/>
				<GroupPicture photo="../asset/default.jpg"/>
				<AddCircleOutlineIcon style={{fontSize:'4em'}} className='add'/>
			</center>
		</div>
	);
};
	
export default ChannelList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ChannelList from '../components/channelList';
import PrivateMessage from '../components/privateMessage';
import TextArea from '../components/textArea';

const Chat: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="chat">
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
			</div>
			<ChannelList />
			<PrivateMessage />
			<TextArea />
		</div>
	);
};

export default Chat;
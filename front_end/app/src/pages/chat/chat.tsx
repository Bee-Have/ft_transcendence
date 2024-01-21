import React from "react";
// import { useNavigate } from "react-router-dom";
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import Conversations from "../../components/Conversation";
import { useParams } from "react-router";
// import ChannelList from "src/components/channelList";

const Chat: React.FC = () => {
	//   const navigate = useNavigate();

	const { id } = useParams()

	const chatId = id ? Number(id) : undefined

	console.log(chatId)

	return (
		<div className="channel-content-wrapper">
			<Conversations chatId={chatId} />
		</div>
	);
};

export default Chat;

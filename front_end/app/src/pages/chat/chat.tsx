import React from "react";
import Conversations from "../../components/Conversation";
import { useParams } from "react-router";

const Chat: React.FC = () => {

	const { id } = useParams()

	const chatId = id ? Number(id) : undefined

	return (
		<div className="channel-content-wrapper">
			<Conversations chatId={chatId} />
		</div>
	);
};

export default Chat;

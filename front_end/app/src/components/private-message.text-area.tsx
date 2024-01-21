import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import InteractiveUsernameConversation from 'src/pages/chat/components/InteractiveUsernameConversation';
import { ConversationProps } from 'src/pages/chat/types/ConversationProps.types';
// import { BuildFriendWithConv } from 'src/pages/global/BuildFriendWithConv';
import { BACKEND_URL } from 'src/pages/global/env';
import { socket } from '../pages/global/websocket';
interface MessageProps {
	id: number,
	createdAt: number,
	content: string,
	isRead: boolean,
	senderId: number,
	conversationId: number,
}

const Message = ({ message, currentChat, userId, isSame }: any) => {

	return (
		<div className="message">
			{isSame ? "" :
				<div className='private-message-header'>
					<Avatar
						className="private-message-avatar"
						alt={message.senderId === userId ? currentChat.conversation.username : currentChat.conversation.friendUsername}
						src={BACKEND_URL + '/user/image/' + message.senderId} />
					{message.senderId === userId ?
						<div className='private-message-name'>
							{currentChat.conversation.username}
						</div> : <div className='wrappi'><InteractiveUsernameConversation chat={currentChat} /></div>}
				</div>}

			<div className={"private-message-message-wrapper "}>
				<div className='private-message-message'>{message.content}</div>
			</div>
		</div>
	)
}

const PrivateTextArea = ({ currentChat, userId }: { currentChat: ConversationProps, userId: number }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
	}, [messages]);

	useEffect(() => {
		axios.get(BACKEND_URL + '/privatemessage/messages/' + currentChat.conversation.id, { withCredentials: true })
			.then((res) => {
				setMessages(res.data)
			})
			.catch((e) => {
				console.log(e)
			})
	}, [currentChat])

	useEffect(() => {
		const listenMessage = (message: MessageProps) => {
			if (currentChat.conversation.id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
				axios.get(BACKEND_URL + '/privatemessage/conversations/isread/' + currentChat.conversation.id, { withCredentials: true })
					.then((res) => console.log(res.data))
					.catch((err) => console.log(err))
			}
		}

		socket?.on('new-message', listenMessage)

		return () => {
			socket?.off('new-message', listenMessage)
		}
	}, [currentChat])

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && inputValue.length !== 0) {
			const element = document.getElementById("test");
			if (element) {
				element.scrollTop = element.scrollHeight;
			}
			axios.post(BACKEND_URL + '/privatemessage/messages', { conversationId: currentChat.conversation.id, content: inputValue }, { withCredentials: true })
				.then((res): any => {
					setMessages([...messages, res.data]);
					setInputValue('');
				})
				.catch((err) => {
					//TODO: popup try again error with message
					console.log(err)
				})
		}
	};

	const isLastMessageSameSender = (index: number) => {
		if (index === 0)
			return false
		if (messages[index].senderId === messages[index - 1].senderId)
			return true
		return false
	}

	return (
		<div className="text-area-wow">
			<div className='messages-container' >
				{messages.map((message, index) => (
					<Message key={index} message={message} currentChat={currentChat} userId={userId} isSame={isLastMessageSameSender(index)} />
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="prompt">
				<TextField
					className='channel-text-field'
					placeholder={'Send message to ' + currentChat.conversation.friendUsername}
					value={inputValue === '\n' ? setInputValue('') : inputValue}
					multiline
					rows={1}
					onChange={(e) => { setInputValue(e.target.value) }}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>
	);
};

export default PrivateTextArea;
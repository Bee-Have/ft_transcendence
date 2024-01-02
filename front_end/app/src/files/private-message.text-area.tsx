import React, { useState, useRef, useEffect } from 'react';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { socket } from './global/websocket';

interface MessageProps {
	id: number,
	createdAt: number,
	content: string,
	isRead: boolean,
	senderId: number,
	conversationId: number,
}

const Message = ({ message, currentChat, userId }: any) => {

	return (
		<div className="message">
			<Avatar alt={message.senderId === userId ? currentChat.conversation.username : currentChat.conversation.friendUsername} src={'http://localhost:3001/user/image/' + message.senderId} />
			<div className="message-content">
				<div className='name'>{message.senderId === userId ? currentChat.conversation.username : currentChat.conversation.friendUsername}</div>
				<div className='msg'>{message.content}</div>
			</div>
		</div>
	)
}

const PrivateTextArea = ({ currentChat, userId }: any) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		axios.get('http://localhost:3001/privatemessage/messages/' + userId + '/' + currentChat.conversation.id)
			.then((res) => {
				setMessages(res.data)
			})
			.catch((e) => {
				console.log(e)
			})
	}, [currentChat])

	useEffect(() => {
		const listenMessage = (message: MessageProps) => {
			if (currentChat.conversation.id === message.conversationId)
			{
				setMessages((prev) => [...prev, message]);
				axios.get('http://localhost:3001/privatemessage/conversations/isread/' + userId + '/' + currentChat.conversation.id)
					.then((res) => console.log(res.data))
					.catch((err) => console.log(err))
			}
		}

		socket?.on('new-message', listenMessage)

		return () => {
			socket?.off('new-message', listenMessage)
		}
	}, [currentChat])

	// const listenMessage = (message: MessageProps) => {
	// 	console.log(message)
	// 	setMessages([...messages, message]);
	// }

	// socket?.on('new-message', listenMessage)

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			const element = document.getElementById("test");
			if (element) {
				element.scrollTop = element.scrollHeight;
			}
			axios.post('http://localhost:3001/privatemessage/messages/' + userId, { conversationId: currentChat.conversation.id, content: inputValue })
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

	return (
		<div className="textArea" id="test">
			<div className='messages-container' >
				{messages.map((message, index) => (
					<Message key={index} message={message} currentChat={currentChat} userId={userId} />
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="prompt">
				<Input
					placeholder={'Send message to ' + currentChat.conversation.friendUsername}
					style={{ width: '100%' }}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>
	);
};

export default PrivateTextArea;
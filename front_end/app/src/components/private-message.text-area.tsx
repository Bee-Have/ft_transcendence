import React, { useState, useRef, useEffect } from 'react';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
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
			{ isSame ? "" :
			<div className='private-message-header'>
				<Avatar className="private-message-avatar" alt={message.senderId === userId ? currentChat.conversation.username : currentChat.conversation.friendUsername} src={'http://localhost:3001/user/image/' + message.senderId} />
				<div className='private-message-name'>{message.senderId === userId ? currentChat.conversation.username : currentChat.conversation.friendUsername}</div>
			</div>}

			<div className={"private-message-message-wrapper "}>
				<div className='private-message-message'>{message.content}</div>
			</div>
		</div>
	)
}

const PrivateTextArea = ({ currentChat, userId }: any) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
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

	const isLastMessageSameSender = (index: number) => {
		if (index === 0)
			return false
		if (messages[index].senderId === messages[index - 1].senderId)
			return true
		return false
	}

	return (
		<div className="textArea" id="test">
			<div className='messages-container' >
				{messages.map((message, index) => (
					<Message key={index} message={message} currentChat={currentChat} userId={userId} isSame={isLastMessageSameSender(index)}/>
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
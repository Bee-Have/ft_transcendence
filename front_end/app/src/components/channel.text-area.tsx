import React, { useState, useRef, useEffect } from 'react';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { socket } from '../pages/global/websocket';

interface ChannelMessageProps {
	id: number,
	createdAt: number,
	content: string,
	senderId: number,
	username: string
	channelId: number,
}

const Message = ({ message, isSame }: any) => {

	return (
		<div className="message">
			{ isSame ? "" :
			<div className='private-message-header'>
				<Avatar className="private-message-avatar" alt={message.username} src={'http://localhost:3001/user/image/' + message.senderId} />
				<div className='private-message-name'>{message.username}</div>
			</div>}

			<div className={"private-message-message-wrapper "}>
				<div className='private-message-message'>{message.content}</div>
			</div>
		</div>
	)
}

const ChannelTextArea = ({ currentChannelId, userId }: any) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<ChannelMessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
	}, [messages]);

	useEffect(() => {
		axios.get('http://localhost:3001/channel/messages/' + userId + '/' + currentChannelId)
			.then((res) => {
				setMessages(res.data)
			})
			.catch((e) => {
				console.log(e)
			})
	}, [currentChannelId])

	useEffect(() => {
		const listenMessage = (message: ChannelMessageProps) => {
			if (currentChannelId === message.channelId)
			{
				setMessages((prev) => [...prev, message]);
			}
		}

		socket?.on('new-channel-message', listenMessage)

		return () => {
			socket?.off('new-channel-message', listenMessage)
		}
	}, [currentChannelId])

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
			axios.post('http://localhost:3001/channel/messages/' + userId, { channelId: currentChannelId, content: inputValue })
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
					<Message key={index} message={message} isSame={isLastMessageSameSender(index)}/>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="prompt">
				<Input
					placeholder={'Send message ...'}
					style={{ width: '100%' }}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>
	);
};

export default ChannelTextArea;
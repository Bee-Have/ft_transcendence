import React, { useState, useRef, useEffect } from 'react';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { socket } from '../../global/websocket';
import { BACKEND_URL } from 'src/pages/global/env';
import { useNavigate } from 'react-router';
import { MemberProps } from '../types/MemberProps.types';

interface ChannelMessageProps {
	id: number,
	createdAt: number,
	content: string,
	senderUserId: number,
	senderMemberId: number,
	username: string,
	channelId: number,
	isInfo: boolean | undefined
}

const Message = ({ message, isSame }: any) => {

	return (
		(message.isInfo === true) ? <div className=''>{message.content}</div> :
			<div className="message">
				{isSame ? "" :
					<div className='private-message-header'>
						<Avatar className="private-message-avatar" alt={message.username} src={BACKEND_URL + '/user/image/' + message.senderUserId} />
						<div className='private-message-name'>{message.username}</div>
					</div>}

				<div className={"private-message-message-wrapper "}>
					<div className='private-message-message'>{message.content}</div>
				</div>
			</div>
	)
}

const ChannelTextArea = ({ currentChannelId }: { currentChannelId: number }) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [messages, setMessages] = useState<ChannelMessageProps[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate()

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
	}, [messages]);

	useEffect(() => {
		axios.get(BACKEND_URL + '/channel/messages/' + currentChannelId, { withCredentials: true })
			.then((res) => {
				setMessages(res.data)
			})
			.catch((e) => {
				console.log(e)
				navigate("/" + e.response.status)
			})
	}, [currentChannelId, navigate])

	useEffect(() => {
		const listenMessage = (message: ChannelMessageProps) => {
			console.log(message, currentChannelId)
			if (currentChannelId === message.channelId) {
				setMessages((prev) => [...prev, message]);
			}
		}

		const listenRole = (info: MemberProps) => {
			if (currentChannelId === info.channelId) {
				let message: ChannelMessageProps  = {
					id: -1,
					createdAt: -1,
					content: info.username + " is ",
					senderUserId: -1,
					senderMemberId: -1,
					username: info.username,
					channelId: info.channelId,
					isInfo: true
				}
				if (info.role === "ADMIN")
					message.content += "Promoted to Admin"
				else
					message.content += "Demoted to Member" 

				setMessages((prev) => [...prev, message]);
			}
		}

		const listenInfo = (info: MemberProps) => {
			if (currentChannelId === info.channelId) {
				let message: ChannelMessageProps  = {
					id: -1,
					createdAt: -1,
					content: info.username + " has been ",
					senderUserId: -1,
					senderMemberId: -1,
					username: "",
					channelId: info.channelId,
					isInfo: true
				}

				if (info.state === "KICKED")
					message.content += "Kicked"
				else if (info.state === "BANNED")
					message.content += "Banned"
				else
					message.content += "Muted for 5 minutes" 

				setMessages((prev) => [...prev, message]);
			}
		}



		socket?.on('new-channel-message', listenMessage)
		socket?.on('channel-role', listenRole)
		socket?.on('channel-info', listenInfo)

		return () => {
			socket?.off('new-channel-message', listenMessage)
			socket?.off('channel-role', listenRole)
			socket?.off('channel-info', listenInfo)

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
			axios.post(BACKEND_URL + '/channel/messages', { channelId: currentChannelId, content: inputValue }, { withCredentials: true })
				.then((res): any => {
					// setMessages([...messages, res.data]);
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
		if (messages[index].senderUserId === messages[index - 1].senderUserId)
			return true
		return false
	}

	return (
		<div className="text-area-wow">
			<div className='messages-container' >
				{messages.map((message, index) => (
					<Message key={index} message={message} isSame={isLastMessageSameSender(index)} />
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
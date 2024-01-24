import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { BACKEND_URL } from 'src/pages/global/env';
import { socket } from '../../global/websocket';
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
		(message.isInfo === true) ? <div className='channel-info'>{message.content}</div> :
			<div className="message">
				{isSame ? "" :
					<div className='private-message-header'>
						<Avatar
							className="private-message-avatar"
							alt={message.username}
							src={BACKEND_URL + '/user/image/' + message.senderUserId} />
						<div className='private-message-name'>
							{message.username}
						</div>
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
				let message: ChannelMessageProps = {
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
				let message: ChannelMessageProps = {
					id: -1,
					createdAt: -1,
					content: info.username + " has ",
					senderUserId: -1,
					senderMemberId: -1,
					username: "",
					channelId: info.channelId,
					isInfo: true
				}

				if (info.state === "KICKED")
					message.content += "been Kicked"
				else if (info.state === "BANNED")
					message.content += "been Banned"
				else if (info.state === "MUTED")
					message.content += "been Muted for 5 minutes"

				setMessages((prev) => [...prev, message]);
			}
		}

		const listenNewMember = (info: MemberProps) => {
			if (currentChannelId === info.channelId) {
				let message: ChannelMessageProps = {
					id: -1,
					createdAt: -1,
					content: info.username + " has joined the channel",
					senderUserId: -1,
					senderMemberId: -1,
					username: "",
					channelId: info.channelId,
					isInfo: true
				}
				setMessages((prev) => [...prev, message]);
			}
		}

		const listenLeaveMember = (info: MemberProps) => {
			if (currentChannelId === info.channelId &&
				(info.state === "REGULAR")) {
				let message: ChannelMessageProps = {
					id: -1,
					createdAt: -1,
					content: info.username + " left the channel",
					senderUserId: -1,
					senderMemberId: -1,
					username: "",
					channelId: info.channelId,
					isInfo: true
				}
				setMessages((prev) => [...prev, message]);
			}
		}


		socket?.on('new-channel-message', listenMessage)
		socket?.on('new-channel-member', listenNewMember)
		socket?.on('leave-channel-member', listenLeaveMember)
		socket?.on('channel-role', listenRole)
		socket?.on('channel-info', listenInfo)

		return () => {
			socket?.off('new-channel-message', listenMessage)
			socket?.off('new-channel-member', listenNewMember)
			socket?.off('leave-channel-member', listenLeaveMember)
			socket?.off('channel-role', listenRole)
			socket?.off('channel-info', listenInfo)
		}
	}, [currentChannelId])

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && inputValue.length !== 0) {
			const element = document.getElementById("test");
			if (element) {
				element.scrollTop = element.scrollHeight;
			}
			axios.post(BACKEND_URL + '/channel/messages', { channelId: currentChannelId, content: inputValue }, { withCredentials: true })
				.then((res): any => {
					setInputValue('');
				})
				.catch((err) => {
					//TODO: popup try again error with message
					if (err.response?.data?.message === "You can not send messages to this Channel") {
						let message: ChannelMessageProps = {
							id: -1,
							createdAt: -1,
							content: err.response.data.message,
							senderUserId: -1,
							senderMemberId: -1,
							username: "",
							channelId: currentChannelId,
							isInfo: true
						}
						setMessages((prev) => [...prev, message]);
						setInputValue('');
					}
					else
						navigate('/' + err.response?.status)
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
				<TextField
					className='channel-text-field'
					placeholder={'Send message ...'}
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

export default ChannelTextArea;
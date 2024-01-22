import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import { Badge, ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ConversationProps } from 'src/pages/chat/types/ConversationProps.types';
import { BACKEND_URL } from 'src/pages/global/env';
import TextInputWithEnterCallback from '../pages/global/TextInput';
import { userId } from '../pages/global/userId';
import { socket } from '../pages/global/websocket';
import PrivateTextArea from './private-message.text-area';
import { errorHandler } from 'src/context/errorHandler';
import { useErrorContext } from 'src/context/ErrorContext';

// import { Conversation } from '../../../../back_end/srcs/src/privatemessage/dto/conversation.dto';
// import { Conversation } from '@prisma/client';

// interface ConversationProps {
//   id: any
//   memberOneId: number
//   memberTwoId: number
// }
// interface ConversationProps {
// 	id: number,
// 	createdAt: number,
// 	memberOneId: number
// 	memberTwoId: number
// 	friendUsername: string
// 	username: string
// }

console.log(userId)

const getColorFromStatus = (status: string): string => {
	if (status === "Online")
		return "green"
	else if (status === "Offline")
		return "grey"
	else if (status === "In game")
		return "red"
	return "blue"
}

const FriendAvatar = ({ conv, friendId, friendUsername }: any) => {

	return (
		<Badge
			overlap="circular"
			variant="dot"
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			sx={{ "& .MuiBadge-badge": { backgroundColor: getColorFromStatus(conv.userstatus) } }} >
			<Avatar
				className={"avatar " + (conv.convIsUnRead ? "unread" : "")}
				alt={friendUsername}
				src={BACKEND_URL + '/user/image/' + friendId}
				sx={{ width: 60, height: 60 }} />
		</Badge>
	)
}

const Conversation = ({ onClick, conv, chatId }: any) => {

	const id = conv.conversation.id
	const friendId = userId === conv.conversation.memberOneId ? conv.conversation.memberTwoId : conv.conversation.memberOneId
	const friendUsername = conv.conversation.friendUsername
	const navigate = useNavigate()


	const han = () => {
		console.log('wef')
	}


	return (
		<div className={chatId === conv.conversation.id ? "friend-selected" : "friend"} >
			<ListItem key={id} onClick={onClick}>
				{
					conv.userstatus ? <FriendAvatar conv={conv} friendId={friendId} friendUsername={friendUsername} /> :
						<Avatar
							className={"avatar " + (conv.convIsUnRead ? "unread" : "")}
							alt={friendUsername}
							src={BACKEND_URL + '/user/image/' + friendId}
							sx={{ width: 60, height: 60 }} />
				}
				<div className="private-message-name">{friendUsername}</div>
			</ListItem>
			{
				chatId === conv.conversation.id ? <div>
					<List sx={{ width: 'fit-content', display: 'flex', flexDirection: 'row', margin: 'auto', flexWrap: 'wrap' }}>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={() => navigate("/profil/" + conv.conversation.friendId)}>Profil</ListItemButton>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={han}>Invite</ListItemButton>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={han}>Spectate</ListItemButton>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={han}>Spectate</ListItemButton>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={han}>Spectate</ListItemButton>
						<ListItemButton sx={{ width: '100px', justifyContent: 'center' }} onClick={han}>Spectate</ListItemButton>
					</List>
				</div> : false
			}
		</div>
	)


};


const Conversations = ({ chatId }: { chatId: number | undefined }) => {

	const [convs, setConvs] = useState<ConversationProps[]>([])
	const [showTextArea, setshowTextArea] = useState(false)
	const [currentChat, setCurrentChat] = useState<ConversationProps>()
	const [createConvBool, setCreateConvBool] = useState(false)
	const navigate = useNavigate()
	const errorContext = useErrorContext();

	useEffect(() => {
		axios.get(BACKEND_URL + '/privatemessage/conversations', { withCredentials: true })
			.then((res): any => {
				if (chatId) {
					const up = res.data.map((m: any) => m.conversation.id === chatId ? { ...m, convIsUnRead: false } : m)
					setConvs(up)
					const cur = up.filter((m: any) => { return m.conversation.id === chatId })[0]
					if (!cur)
						navigate('/404')
					setCurrentChat(cur)
					setshowTextArea(true)
				}
				else
					setConvs(res.data)
			})
			.catch((err) => {
				errorContext.newError?.(errorHandler(err))
			})
	}, [chatId, navigate])

	useEffect(() => {
		const listenNewConv = (conv: ConversationProps) => {
			setConvs((prev) => [...prev, conv])
		}

		socket?.on('new-conv', listenNewConv)

		return () => {
			socket?.off('new-conv', listenNewConv)
		}
	}, [])

	const handleclick = (e: ConversationProps) => {
		convUpdateUnReadStatus(e.conversation.id, false)
		navigate('/chat/' + e.conversation.id)
	}

	const createConv = () => {
		setCreateConvBool(!createConvBool)
	}

	const hideInput = () => {
		setCreateConvBool(false)
	}

	const createConvCallBack = (inputValue: any) => {
		axios.get(BACKEND_URL + '/user/idbyname/' + inputValue, { withCredentials: true })
			.then((response) => {
				axios.post(BACKEND_URL + '/privatemessage/conversations/' + response.data, null, { withCredentials: true })
					.then((res) => {
						const exist = convs.some((conv) => conv.conversation.id === res.data.conversation.id)
						if (!exist)
							setConvs((prev) => [...prev, res.data])
					})
					.catch(e => errorContext.newError?.(errorHandler(e)))
			})
			.catch((e) => errorContext.newError?.(errorHandler(e)))
	}

	const convUpdateUnReadStatus = (conversationId: number, readStatus: boolean) => {
		const updated = convs.map(conv => conv.conversation.id === conversationId ? { ...conv, convIsUnRead: readStatus } : conv)

		setConvs(updated)
	}

	useEffect(() => {
		const listenNewMessage = (message: any) => {
			if (!currentChat || currentChat.conversation.id !== message.conversationId) {
				const updated = convs.map(conv => conv.conversation.id === message.conversationId ? { ...conv, convIsUnRead: true } : conv)

				setConvs(updated)
			}
		}

		const listenNewStatus = (status: any) => {
			console.log(status)
			const updatedConvs = convs.map(conv =>
				conv.conversation.memberOneId === status.userId || conv.conversation.memberTwoId === status.userId
					? { ...conv, userstatus: status.userstatus } : conv)
			setConvs(updatedConvs)
		}

		socket?.on('new-message', listenNewMessage)
		socket?.on('user-status', listenNewStatus)

		return () => {
			socket?.off('new-message', listenNewMessage)
			socket?.off('user-status', listenNewStatus)
		}
	}, [currentChat, convs])

	return (
		<>
			<div className='channel-top-bar'>
				{showTextArea && currentChat && <><img
					className='channel-top-bar-img'
					alt={currentChat.conversation.friendUsername + " avatar"}
					src={BACKEND_URL + '/user/image/' + currentChat.conversation.friendId} />
					<div className='private-message-name'>{currentChat.conversation.friendUsername}</div>
				</>}
				<div className="left-but"><button className="btn btn-light" onClick={() => navigate("/")}>home</button> </div>
			</div>
			<div className="channel-member-bar">
				<div onClick={createConv} className='privMsg'>
					Private message +
					{createConvBool && <TextInputWithEnterCallback onEnterPress={createConvCallBack} hideInput={hideInput} />}
				</div>
				<List>
					{convs ? (
						<div>
							{Object.keys(convs).map((i) => (
								<Conversation
									key={convs[i].conversation.id}
									onClick={() => handleclick(convs[i])}
									conv={convs[i]}
									chatId={chatId} />
							))}
						</div>
					) : null}
				</List>
			</div>
			{showTextArea && currentChat && <PrivateTextArea currentChat={currentChat} userId={userId} />}
		</>
	);
}

export default Conversations;




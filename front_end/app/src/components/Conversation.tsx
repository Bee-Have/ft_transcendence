import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import { Badge } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ConversationProps } from 'src/pages/chat/types/ConversationProps.types';
import { BuildFriendWithConv } from 'src/pages/global/BuildFriendWithConv';
import { BACKEND_URL } from 'src/pages/global/env';
import TextInputWithEnterCallback from '../pages/global/TextInput';
import { userId } from '../pages/global/userId';
import { socket } from '../pages/global/websocket';
import InteractiveUsername from './interactive/InteractiveUsername';
import PrivateTextArea from './private-message.text-area';

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

const Conversation = ({ onClick, conv }: any) => {

	const id = conv.conversation.id
	const friendId = userId === conv.conversation.memberOneId ? conv.conversation.memberTwoId : conv.conversation.memberOneId
	const friendUsername = conv.conversation.friendUsername

	const showMenu = (e: any) => {
		//TODO: Add the popup menu for conversations
		e.preventDefault()
	}

	return (
		<div className="friend" >
			<ListItemButton key={id} onClick={onClick} onContextMenu={showMenu}>
				{
					conv.userstatus ? <FriendAvatar conv={conv} friendId={friendId} friendUsername={friendUsername} /> :
						<Avatar
							className={"avatar " + (conv.convIsUnRead ? "unread" : "")}
							alt={friendUsername}
							src={BACKEND_URL + '/user/image/' + friendId}
							sx={{ width: 60, height: 60 }} />
				}

				<div className="channel-member-list-name">{friendUsername}</div>
			</ListItemButton>
		</div>
	)


};


const Conversations: React.FC = () => {

	const [convs, setConvs] = useState<ConversationProps[]>([])
	const [showTextArea, setshowTextArea] = useState(false)
	const [currentChat, setCurrentChat] = useState<ConversationProps>()
	const [createConvBool, setCreateConvBool] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(BACKEND_URL + '/privatemessage/conversations', { withCredentials: true })
			.then((res): any => {
				setConvs(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

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
		setCurrentChat(e)
		setshowTextArea(true)
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
					.catch(e => console.log(e))
			})
			.catch((e) => console.log(e))
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
					<div className='wrappi margin-left-10px'><InteractiveUsername user={BuildFriendWithConv(currentChat)}/></div></>}
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
								<Conversation key={convs[i].conversation.id} onClick={() => handleclick(convs[i])} conv={convs[i]} />
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




import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import { Badge } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TextInputWithEnterCallback from '../pages/global/TextInput';
import { userId } from '../pages/global/userId';
import { socket } from '../pages/global/websocket';
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

interface ConversationProps {
	conversation: {
		id: number
		createdAt: number,
		memberOneId: number
		memberTwoId: number
		friendUsername: string
		username: string
	}
	lastMessage: object
	convIsUnRead: boolean
	status: string | null
}

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
			sx={{ "& .MuiBadge-badge": { backgroundColor: getColorFromStatus(conv.status) } }} >
			<Avatar
				className={"avatar " + (conv.convIsUnRead ? "unread" : "")}
				alt={friendUsername}
				src={'http://localhost:3001/user/image/' + friendId} />
		</Badge>
	)
}

const Conversation = ({ onClick, conv }: any) => {

	const id = conv.conversation.id
	const friendId = userId === conv.conversation.memberOneId ? conv.conversation.memberTwoId : conv.conversation.memberOneId
	const friendUsername = conv.conversation.friendUsername

	return (
		<div className="friend" >
			<ListItemButton key={id} onClick={onClick}>
				{
					conv.status ? <FriendAvatar conv={conv} friendId={friendId} friendUsername={friendUsername} /> :
						<Avatar
							className={"avatar " + (conv.convIsUnRead ? "unread" : "")}
							alt={friendUsername}
							src={'http://localhost:3001/user/image/' + friendId} />
				}

				<div className="name">{friendUsername}</div>
			</ListItemButton>
		</div>
	)


};


const Conversations: React.FC = () => {

	const [convs, setConvs] = useState<ConversationProps[]>([])
	const [showTextArea, setshowTextArea] = useState(0)
	const [currentChat, setCurrentChat] = useState<ConversationProps>()
	const [createConvBool, setCreateConvBool] = useState(false)


	useEffect(() => {
		axios.get('http://localhost:3001/privatemessage/conversations/' + userId)
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
		setshowTextArea(showTextArea + 1)
	}

	const createConv = () => {
		setCreateConvBool(!createConvBool)
	}

	const hideInput = () => {
		setCreateConvBool(false)
	}

	const createConvCallBack = (inputValue: any) => {
		axios.get('http://localhost:3001/user/idbyname/' + inputValue, { withCredentials: true })
			.then((response) => {
				axios.post('http://localhost:3001/' + 'privatemessage/conversations/' + userId + '/' + response.data, null, { withCredentials: true })
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
			if (!currentChat || currentChat.conversation.id !== message.conversationId)
				convUpdateUnReadStatus(message.conversationId, true)
		}

		const listenNewStatus = (status: any) => {
			console.log(status)
			const updatedConvs = convs.map(conv =>
				conv.conversation.memberOneId === status.userId || conv.conversation.memberTwoId === status.userId
					? { ...conv, status: status.status } : conv)
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
		<div className="channelPeople">
			<div onClick={createConv} className='privMsg'>
				Private message +
				{createConvBool && <TextInputWithEnterCallback onEnterPress={createConvCallBack} hideInput={hideInput} />}
			</div>
			<List component="nav" aria-label="mailbox folders">
				{convs ? (
					<div>
						{Object.keys(convs).map((i) => (
							<Conversation key={convs[i].conversation.id} onClick={() => handleclick(convs[i])} conv={convs[i]} />
						))}
					</div>
				) : null}
			</List>
			{showTextArea === 0 ? false : <PrivateTextArea currentChat={currentChat} userId={userId} />}
		</div>
	);
}

export default Conversations;




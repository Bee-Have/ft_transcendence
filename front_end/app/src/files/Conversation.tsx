import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PrivateTextArea from './private-message.text-area';
import { userId } from './global/userId';
import ListItemButton from '@mui/material/ListItemButton';
import TextInputWithEnterCallback from './global/TextInput';

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
		id:number
		createdAt: number,
		memberOneId: number
		memberTwoId: number
		friendUsername: string
		username: string
	}
	lastmessage: object
}

console.log(userId)

const Conversation = ({onClick, conv}: any) => {

	// console.log(conv)
	
	const id = conv.conversation.id
	const friendId = userId === conv.conversation.memberOneId ? conv.conversation.memberTwoId : conv.conversation.memberOneId
	const friendUsername = conv.conversation.friendUsername

	return (
		<div className="friend">
			<ListItemButton key={id} onClick={onClick}>
				<Avatar className="avatar" alt={friendUsername} src={'http://localhost:3001/user/image/' + friendId} />
				<div className="name">{friendUsername}</div>
			</ListItemButton>
		</div>
	)


};


const Conversations: React.FC = () => {

	const [convs, setConvs] = useState<ConversationProps[]>([])
	const [showTextArea, setshowTextArea] = useState(0)
	const [currentChat, setCurrentChat] = useState(null)
	const [createConvBool, setCreateConvBool] = useState(false)


	useEffect(() => {
		const getConvs = async () => {
			axios.get('http://localhost:3001/privatemessage/conversations/' + userId)
			.then((res) => {
				setConvs(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
		}
		getConvs()
	}, [])
	
	const handleclick = (e: any) => {
		setCurrentChat(e)
		setshowTextArea(showTextArea + 1)
	}

	const createConv = () => {
		setCreateConvBool(!createConvBool)
	}

	const createConvCallBack = (inputValue: any) => {
		axios.get('http://localhost:3001/user/idbyname/' + inputValue, { withCredentials: true })
		.then( (res) => {
			axios.post('http://localhost:3001/' + 'privatemessage/conversations/' + userId + '/' + res.data)
			.then((res) => {
				const data: any = new Object()
				data["conversation"] = res.data
				const exist = convs.some((conv) => conv.conversation.id === res.data.id)
				if (!exist)	
					setConvs((prev) => [...prev, data])
			})
			.catch(e => console.log(e))
		})
		.catch((e) => console.log(e))
	}

	return (
		<div className="channelPeople">
		  	<div onClick={createConv} className='privMsg'>
				Private message +
				{createConvBool && <TextInputWithEnterCallback onEnterPress={createConvCallBack}/>}
			</div>
			<List component="nav" aria-label="mailbox folders">
				{ convs ? (
					<div>
						{Object.keys(convs).map((i) => (
							<Conversation key={convs[i].conversation.id} onClick={() => handleclick(convs[i])} conv={convs[i]}/>
						))}
					</div>
				) : null }
			</List>
			{showTextArea === 0 ? false : <PrivateTextArea currentChat={currentChat} userId={userId}/>}
		</div>
	  );
}

export default Conversations;




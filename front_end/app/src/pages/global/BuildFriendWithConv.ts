import { ConversationProps } from "../chat/types/ConversationProps.types"
import { BACKEND_URL } from "./env"
import { Friend } from "./friend.dto"

export const BuildFriendWithConv = (conv: ConversationProps) => {
	console.log(conv)
	const friend: Friend = {
		id: conv.conversation.friendId,
		username: conv.conversation.friendUsername,
		userstatus: conv.userstatus,
		photo: BACKEND_URL + '/user/image/' + conv.conversation.friendId 
	}
	return friend
}

import { UserStatus } from "src/user/gateway/dto/userStatus.dto"
import { OutgoingDirectMessage } from "./direct-message.dto"

export class ConversationProps {
	conversation: Conversation
	lastMessage: OutgoingDirectMessage
	convIsUnRead: boolean
	userstatus: UserStatus | null
}

export class Conversation {
	id: number
	memberOneId: number
	memberOneUsername: string
	memberTwoId: number
	memberTwoUsername: string
	friendUsername: string
	friendId: number
	username: string
}
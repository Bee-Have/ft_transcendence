import { UserStatus } from "src/user/gateway/dto/userStatus.dto"
import { OutgoingDirectMessage } from "./direct-message.dto"

export class ConversationProps {
	conversation: Conversation
	lastMessage: OutgoingDirectMessage
	convIsUnRead: boolean
	status: UserStatus | null
}

export class Conversation {
	id: number
	memberOneId: number
	memberOneUsername: string
	memberTwoId: number
	memberTwoUsername: string
	friendUsername: string
	username: string
}
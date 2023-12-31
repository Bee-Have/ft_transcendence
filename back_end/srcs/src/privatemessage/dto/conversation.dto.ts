import { OutgoingDirectMessage } from "./direct-message.dto"

export class ConversationProps {
	conversation: Conversation
	lastMessage: OutgoingDirectMessage
	convIsUnRead: boolean
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
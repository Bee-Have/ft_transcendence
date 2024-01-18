import { UserStatus } from "src/pages/global/friend.dto"

export interface ConversationProps {
	conversation: {
		id: number
		memberOneId: number
		memberOneUsername: string
		memberTwoId: number
		memberTwoUsername: string
		friendUsername: string
		friendId: number
		username: string
	}
	lastMessage: {
		id: number
		conversationId: number
		senderId: number
		createdAt: Date
		content: string
		isRead: boolean
	}
	convIsUnRead: boolean
	userstatus: UserStatus | null
}

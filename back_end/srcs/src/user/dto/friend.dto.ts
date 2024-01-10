import { UserStatus } from "../gateway/dto/userStatus.dto"

export class Friend {
	id: number
	username: string
	userstatus: UserStatus
}

export class FriendRequest {
	id: number
	userstatus: UserStatus
	username: string
}
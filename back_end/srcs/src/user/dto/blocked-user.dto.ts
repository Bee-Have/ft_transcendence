import { UserStatus } from "../gateway/dto/userStatus.dto"

export class BlockedUser {
	username: string
	id: number
	userstatus: UserStatus
}
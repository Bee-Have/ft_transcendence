// export class Friend {
// 	id: number
// 	username: string
// 	status: string
// }

export enum UserStatus {
	online = "Online" as any,
	offline = "Offline" as any,
	ingame = "Playing" as any,
	ingamesolo = "Training" as any,
	inchat = "In chat" as any
}

export class Friend {
	id: number
	username: string
	userstatus: UserStatus
	photo: string
}

export class FriendRequest {
	id: number
	userstatus: UserStatus
	username: string
}

export class UserStatusEventDto {
	userId: number
	userstatus: UserStatus
}
// export class Friend {
// 	id: number
// 	username: string
// 	status: string
// }

export enum UserStatus {
	online = "Online",
	offline = "Offline",
	ingame = "In game",
	inchat = "In chat"
}

export class Friend {
	id: number
	username: string
	status: UserStatus
	photo: string
}

export class FriendRequest {
	id: number
	username: string
}
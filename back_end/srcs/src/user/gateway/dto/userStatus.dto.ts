import { Socket } from 'socket.io'

export enum UserStatus {
	online = "Online",
	offline = "Offline",
	ingame = "In game",
	inchat = "In chat"
}

export class UserInfo {
	id: number
	socket: Socket
	userstatus: UserStatus

	constructor(userId: number, socket: Socket, status: UserStatus) {
		this.id = userId
		this.socket = socket
		this.userstatus = status
	}

	updateStatus(status: UserStatus) {
		this.userstatus = status
		return this
	}
}

export class UserStatusEventDto {
	userId: number
	userstatus: UserStatus

	constructor(user: UserInfo) {	
		this.userId = user.id	
		this.userstatus = user.userstatus
	}
}

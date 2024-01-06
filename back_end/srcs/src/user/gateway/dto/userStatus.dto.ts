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
	status: UserStatus

	constructor(userId: number, socket: Socket, status: UserStatus) {
		this.id = userId
		this.socket = socket
		this.status = status
	}

	updateStatus(status: UserStatus) {
		this.status = status
		return this
	}
}

export class UserStatusEventDto {
	userId: number
	status: UserStatus

	constructor(user: UserInfo) {	
		this.userId = user.id	
		this.status = user.status
	}
}

import { Socket } from 'socket.io'

export enum UserStatus {
	online = "Online" as any,
	offline = "Offline" as any,
	ingame = "Playing" as any,
	ingamesolo = "Training" as any,
	inchat = "In chat" as any
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

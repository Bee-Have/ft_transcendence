import { Socket } from 'socket.io'

export enum UserStatus {
	online = "online",
	offline = "offline",
	ingame = "ingame",
	inchat = "inchat"
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

export function UserStatusEventDto(user: UserInfo) {
	this.userId = user.id
	this.status = user.status
}

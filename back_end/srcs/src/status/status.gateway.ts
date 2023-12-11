import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketExceptionsFilter } from './status.filter';

enum UserStatus {
	online = "online",
	offline = "offline",
	ingame = "ingame",
	inchat = "inchat"
}

class UserInfo {
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

function UserStatusEventDto(user: UserInfo) {
	this.userId = user.id
	this.status = user.status
}

@WebSocketGateway({ namespace: 'user/status' })
@UseFilters(new WebsocketExceptionsFilter())
export class StatusGateway {

	private connected_user_map = new Map<number, UserInfo>()

	constructor(private prisma: PrismaService) {}

	@WebSocketServer()
	server: Namespace

	// afterInit(client: Socket) {
	// 	client.use(SocketAuthMiddleware() as any)
	// }

	async handleConnection(@ConnectedSocket() client: Socket) {					
		const user = await this.prisma.user.findUnique({
			where: {
				id: Number(client.handshake.headers.id)
			},
			select: {
				id: true,
				friends: {
					select: {
						id: true
					}
				}
			}
		})

		if(!user)
		{
			client.emit('error', {msg: 'User Not Found'})
			client.disconnect()
		}

		this.connected_user_map.set(user.id, new UserInfo(user.id, client, UserStatus.online))

		const user_in_map = this.connected_user_map.get(user.id)

		for (const friend of user.friends) {
			const friend_in_map = this.connected_user_map.get(friend.id)

			if (friend_in_map)
			{
				friend_in_map.socket.join(user.id.toString())
				client.join(friend.id.toString())

				client.emit('user-status', new UserStatusEventDto(friend_in_map))
				friend_in_map.socket.emit('user-status', new UserStatusEventDto(user_in_map))
			}
		}
	}

	@SubscribeMessage('update-user-status')
	updateUserStatus(@ConnectedSocket() client: Socket, @MessageBody() data: string){

		const userId: number = Number(client.handshake.headers.id)

		const user = this.connected_user_map.get(userId)

		const enum_keys = Object.keys(UserStatus)

		if (!enum_keys.includes(data))
			throw new WsException('Wrong user status')

		for (const key of enum_keys)
		{
			if (data === key)
				user.updateStatus(UserStatus[key])
		}

		this.server.in(user.id.toString()).emit('user-status', new UserStatusEventDto(user))

	}

	handleDisconnect(@ConnectedSocket() client: Socket) {

		const userId: number = Number(client.handshake.headers.id)	
		
		const user = this.connected_user_map.get(userId)

		user.updateStatus(UserStatus.offline)

		this.server.in(user.id.toString()).emit('user-status', new UserStatusEventDto(user))

		this.connected_user_map.delete(user.id)
	}

}


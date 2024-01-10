import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OutgoingDirectMessage } from 'src/privatemessage/dto/direct-message.dto';
import { UserInfo, UserStatus, UserStatusEventDto } from 'src/user/gateway/dto/userStatus.dto';
import { UserService } from 'src/user/user.service';
import { PrivateMessageService } from '../../privatemessage/privatemessage.service';
import { BlockedUserDto } from './dto/blocked-user.dto';
import { FriendRequestDto } from './dto/frien-request.dto';
import { WsExceptionFilter } from './filter/user.filter';

@WebSocketGateway({ namespace: 'user', cors: true })
@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
export class UserGateway {

	constructor(private prisma: PrismaService, 
				private userService: UserService,
				private friendService: FriendshipService,
				private privmessage: PrivateMessageService) {}

	@WebSocketServer()
	server: Namespace

	//TODO use this midleware to use JWT auth
	// afterInit(client: Socket) {
	// 	client.use(SocketAuthMiddleware() as any)
	// }

	async handleConnection(@ConnectedSocket() client: Socket) {

		const userId: number = Number(client.handshake?.headers?.id)

		console.log(userId, 'connect')

		if (Number.isNaN(userId))
		{
			client.disconnect()
			return
		}

		// if (this.userService.connected_user_map.get(userId))
		// {
		// 	console.log('UserId: ' + userId, 'tried to connect to websocket while already being connected')
		// 	client.disconnect()
		// 	return
		// }


		const friendsIds = await this.userService.getUserFriendsId(userId)

		this.userService.connected_user_map.set(userId, new UserInfo(userId, client, UserStatus.online))

		const user_in_map = this.userService.connected_user_map.get(userId)

		for (const friendId of friendsIds) {
			const friend_in_map = this.userService.connected_user_map.get(friendId)

			if (friend_in_map)
			{
				friend_in_map.socket.join(userId.toString())
				client.join(friendId.toString())

				client.emit('user-status', new UserStatusEventDto(friend_in_map))
				friend_in_map.socket.emit('user-status', new UserStatusEventDto(user_in_map))
			}
		}
	}

	@SubscribeMessage(process.env.SERVER_UPDATE_USER_STATUS)
	updateUserStatus(@ConnectedSocket() client: Socket, @MessageBody() data: string){

		const userId: number = Number(client.handshake.headers.id)

		const user = this.userService.connected_user_map.get(userId)

		const enum_keys = Object.keys(UserStatus)

		if (!enum_keys.includes(data))
			throw new WsException({msg: 'Wrong user status'})

		for (const key of enum_keys)
		{
			if (data === key)
				user.updateStatus(UserStatus[key])
		}
		this.server.in(userId.toString()).emit(process.env.CLIENT_USER_STATUS, new UserStatusEventDto(user))
	}

	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client, @MessageBody() body: OutgoingDirectMessage)
	{
		const friendId = await this.privmessage.getFriendIdByConvId(body.senderId, body.conversationId)
	
		const friend = this.userService.connected_user_map.get(friendId)

		if (friend)
			friend.socket.emit('new-message', body)

	}

	handleDisconnect(@ConnectedSocket() client: Socket) {

		const userId: number = Number(client.handshake.headers.id)

		const user = this.userService.connected_user_map.get(userId)
		
		console.log(userId, 'disconnect')

		if (!user)
			return

		user.updateStatus(UserStatus.offline)

		this.server.in(userId.toString()).emit(process.env.CLIENT_USER_STATUS, new UserStatusEventDto(user))
		this.server.adapter.rooms.delete(userId.toString())

		this.userService.connected_user_map.delete(userId)
	}

}


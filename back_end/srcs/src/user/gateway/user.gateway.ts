import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { FriendshipService } from 'src/friendship/friendship.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo, UserStatus, UserStatusEventDto } from 'src/user/gateway/dto/userStatus.dto';
import { UserService } from 'src/user/user.service';
import { FriendRequestDto } from './dto/frien-request.dto';
import { WsExceptionFilter } from './filter/user.filter';
import { BlockedUserDto } from './dto/blocked-user.dto';

@WebSocketGateway({ namespace: 'user' })
@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
export class UserGateway {

	constructor(private prisma: PrismaService, 
				private userService: UserService,
				private friendService: FriendshipService) {}

	@WebSocketServer()
	server: Namespace

	//TODO use this midleware to use JWT auth
	// afterInit(client: Socket) {
	// 	client.use(SocketAuthMiddleware() as any)
	// }

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log(process.env.SERVER_UPDATE_USER_STATUS)				
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
			return 
		}

		this.userService.connected_user_map.set(user.id, new UserInfo(user.id, client, UserStatus.online))

		const user_in_map = this.userService.connected_user_map.get(user.id)

		for (const friend of user.friends) {
			const friend_in_map = this.userService.connected_user_map.get(friend.id)

			if (friend_in_map)
			{
				friend_in_map.socket.join(user.id.toString())
				client.join(friend.id.toString())

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
		this.server.in(user.id.toString()).emit(process.env.CLIENT_USER_STATUS, new UserStatusEventDto(user))
	}


	@SubscribeMessage(process.env.SERVER_CREATE_FRIEND_REQUEST)
	async handleCreateFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() data: FriendRequestDto) {
		
		console.log('ehejwfef')

		const senderId: number = Number(client.handshake.headers.id)
		const receiverId: number = data.receiverId
		
		await this.friendService.createFriendRequest(senderId, receiverId)

		client.emit(process.env.CLIENT_FRIEND_REQUEST_CREATED, receiverId)

		const receiver = this.userService.connected_user_map.get(receiverId)
		const receiv = await this.prisma.user.findUnique({where: {id: receiverId}})
	
		if (receiver && 
			receiver.status != UserStatus.ingame && 
			receiver.status != UserStatus.offline)
		{
			receiver.socket.emit(process.env.CLIENT_FRIEND_REQUEST_RECEIVED, { from: {id: senderId, username: receiv.username} })
		}
	}


	@SubscribeMessage(process.env.SERVER_CANCEL_FRIEND_REQUEST)
	async handleCancelFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() data: FriendRequestDto) {
		
		const senderId: number = Number(client.handshake.headers.id)
		const receiverId: number = data.receiverId
		
		await this.friendService.cancelFriendRequest(senderId, receiverId)

		client.emit(process.env.CLIENT_FRIEND_REQUEST_CANCELED, receiverId)
	}


	@SubscribeMessage(process.env.SERVER_ACCEPT_FRIEND_REQUEST)
	async handleAcceptFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() data: FriendRequestDto) {

		const acceptorId: number = Number(client.handshake.headers.id)
		const receiverId: number = data.receiverId

		await this.friendService.acceptFriendRequest(acceptorId, receiverId)
		
		client.emit(process.env.CLIENT_FRIEND_REQUEST_ACCEPTED, receiverId)
	}


	@SubscribeMessage(process.env.SERVER_REJECT_FRIEND_REQUEST)
	async handleRejectFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() data: FriendRequestDto) {

		const rejectorId: number = Number(client.handshake.headers.id)
		const receiverId: number = data.receiverId

		await this.friendService.rejectFriendRequest(rejectorId, receiverId)
	
		client.emit(process.env.CLIENT_FRIEND_REQUEST_REJECTED, receiverId)
	}

	@SubscribeMessage(process.env.SERVER_BLOCK_USER)
	async handleBlockUser(@ConnectedSocket() client: Socket, @MessageBody() data: BlockedUserDto) {

		const userId: number = Number(client.handshake.headers.id)
		const blockedUserId = data.blokedUserId

		
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {

		const userId: number = Number(client.handshake.headers.id)
		
		const user = this.userService.connected_user_map.get(userId)

		user.updateStatus(UserStatus.offline)

		this.server.in(user.id.toString()).emit(process.env.CLIENT_USER_STATUS, new UserStatusEventDto(user))

		this.userService.connected_user_map.delete(user.id)
	}

}


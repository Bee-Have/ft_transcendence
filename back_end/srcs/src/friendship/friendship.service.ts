import { BadRequestException, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { PrismaService } from "src/prisma/prisma.service";
import { Length } from 'class-validator';

class FriendRequestError extends WsException {
	constructor(public cause: string, private receiverId:number, private action: string){
		super({cause, receiverId})
		super.getError()
		super.message = 'Friend Request Error'
	}
}

@Injectable()
export class FriendshipService {

	constructor(private prisma: PrismaService) {}

	async createFriendRequest(senderId: number, receiverId: number) {
		if (senderId === receiverId)
			throw new FriendRequestError('Sender cant be receiver', receiverId, 'creation')


		const receiver = await this.prisma.user.findUnique({
			where: {
				id: receiverId
			},
		})
		if (!receiver)
			throw new FriendRequestError('User does not exist', receiverId, 'creation')			


		const friends_of_receiver = await this.prisma.user.findUnique({
			where:{
				id: receiverId
			},
			select: {
				friends: {
					where: {
						id: senderId
					}
				}
			}
		})
		if (friends_of_receiver.friends.length)
			throw new FriendRequestError('Users already friends', receiverId, 'creation')			


		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId,
				receiverId
			}
		})
		if (req)
			throw new FriendRequestError('Friend Request already exist', receiverId, 'creation')


		const createdReq = await this.prisma.friendRequest.create({
			data: {
				senderId,
				receiverId,
				status: 'pending'
			}
		})
		if (!createdReq)
			throw new FriendRequestError('Error While creating the friendRequest', receiverId, 'creation')
	}


	async cancelFriendRequest(senderId: number, receiverId: number) {
		if (senderId === receiverId)
			throw new FriendRequestError('Sender cant be receiver', receiverId, 'deletion')

		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId,
				receiverId
			}
		})
		if (!req)
			throw new FriendRequestError('Friend Request does not exist', receiverId, 'deletion')
	
		const deletion = await this.prisma.friendRequest.delete({
			where: {
				id: req.id
			}
		})
		if (!deletion)
			throw new FriendRequestError('Error while deleting friend request', receiverId, 'deletion')
	}


	async acceptFriendRequest(acceptorId: number, receiverId: number) {
		if (acceptorId === receiverId)
			throw new FriendRequestError('Acceptor cant be receiver', receiverId, 'acceptation')

		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId: receiverId,
				receiverId: acceptorId
			}
		})
		if (!req)
			throw new FriendRequestError('Friend Request does not exist', receiverId, 'acceptation')
	
		await this.prisma.user.update({
			where: {
				id: acceptorId
			},
			data: {
				friends: {
					connect: [{ id: receiverId }]
				}
			}
		})

		await this.prisma.user.update({
			where: {
				id: receiverId
			},
			data: {
				friends: {
					connect: [{ id: acceptorId }]
				}
			}
		})

		await this.prisma.friendRequest.delete({
			where:{
				id: req.id
			}
		})
	}

	
	async rejectFriendRequest(rejectorId: number , receiverId: number) {
		if (rejectorId === receiverId)
			throw new FriendRequestError('Rejector cant be receiver', receiverId, 'rejection')
	
		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId: receiverId,
				receiverId: rejectorId
			}
		})
		if (!req)
			throw new FriendRequestError('Friend Request does not exist', receiverId, 'rejection')

		await this.prisma.friendRequest.delete({
			where:{
				id: req.id
			}
		})	
	}

}
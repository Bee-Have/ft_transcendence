import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendshipService {

	constructor(private prisma: PrismaService,) {}

	async createFriendRequest(senderId: number, receiverId: number) {
		if (senderId === receiverId)
			throw new BadRequestException('Sender cant be receiver')

		const receiver = await this.prisma.user.findUnique({
			where: {
				id: receiverId
			},
		})
		if (!receiver)
			throw new NotFoundException('User does not exist')			


		const friends_of_receiver = await this.prisma.user.findUnique({
			where:{
				id: receiverId
			},
			select: {
				friends: {
					where: {
						id: senderId
					}
				},
				friendsRelation: {
					where: {
						id: senderId
					}
				}
			}
		})
		if (friends_of_receiver.friends.length || friends_of_receiver.friendsRelation.length)
			throw new BadRequestException('Users already friends')

		const req = await this.prisma.friendRequest.findFirst({
			where: {
				OR: [
					{senderId, receiverId},
					{senderId: receiverId, receiverId: senderId}
				]
			}
		})
		if (req?.senderId === senderId)
			throw new BadRequestException('Friend Request already exist')
		if (req?.senderId === receiverId) {
			await this.acceptFriendRequest(senderId, req.senderId)
			return
		}

		const createdReq = await this.prisma.friendRequest.create({
			data: {
				senderId,
				receiverId,
				status: 'pending'
			}
		})
		if (!createdReq)
			throw new InternalServerErrorException('Error While creating the friendRequest')
	}


	async cancelFriendRequest(senderId: number, receiverId: number) {
		if (senderId === receiverId)
		throw new BadRequestException('Sender cant be receiver')

		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId,
				receiverId
			}
		})
		if (!req)
			throw new BadRequestException('Friend Request does not exist')
	
		const deletion = await this.prisma.friendRequest.delete({
			where: {
				id: req.id
			}
		})
		if (!deletion)
			throw new InternalServerErrorException('Error while deleting friend request')
	}


	async acceptFriendRequest(acceptorId: number, receiverId: number) {
		if (acceptorId === receiverId)
			throw new BadRequestException('Acceptor cant be receiver')

		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId: receiverId,
				receiverId: acceptorId
			}
		})
		if (!req)
			throw new NotFoundException('Friend Request Not Found')
	
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

		await this.prisma.friendRequest.delete({
			where:{
				id: req.id
			}
		})
	}

	
	async rejectFriendRequest(rejectorId: number , receiverId: number) {
		if (rejectorId === receiverId)
			throw new BadRequestException('Rejector cant be receiver')
	
		const req = await this.prisma.friendRequest.findFirst({
			where: {
				senderId: receiverId,
				receiverId: rejectorId
			}
		})
		if (!req)
			throw new NotFoundException('Friend Request does not exist')

		await this.prisma.friendRequest.delete({
			where:{
				id: req.id
			}
		})	
	}


	async blockUser(userId: number, blockedUserId: number){
		const userExist = await this.userExist(blockedUserId)

		if (!userExist)
			throw new NotFoundException('The blocked user does not exist')
		
		const blocked = await this.prisma.blockedUser.findFirst({
			where: {
				userId,
				blockedUserId
			}
		})

		if (blocked)
			throw new BadRequestException('User Already Blocked')
	
		try {
			await this.prisma.blockedUser.create({
				data: {
					userId,
					blockedUserId
				}
			})
		}
		catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}

	async unblockUser(userId: number, blockedUserId: number) {
		const userExist = await this.userExist(blockedUserId)

		if (!userExist)
			throw new NotFoundException('The User does not exist')
		
		const blocked = await this.prisma.blockedUser.findFirst({
			where: {
				userId,
				blockedUserId
			}
		})
	
		if (!blocked)
			throw new BadRequestException("This User isn't blocked")

		await this.prisma.blockedUser.delete({ where: {id: blocked.id} })
	}

	async isUserBlocked(blockerId: number, blockedId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: blockerId
			},
			select: {
				id: true,
				blocked: true
			}
		})

		if (!user)
			throw new NotFoundException('User Not found')

		for (const blocked of user.blocked) {
			if (blockedId === blocked.blockedUserId)
				return true
		}
		return false
	}

	async deleteFriend(userId: number, receiverId: number) {
		if (userId === receiverId)
			throw new BadRequestException('Sender cant be receiver')

		try {
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					friends: {
						disconnect: [{id: receiverId}]
					},
					friendsRelation: {
						disconnect: [{id: receiverId}]
					}
				}
			})
		}
		catch(e) {
			console.log(e)
			throw new InternalServerErrorException('Error while deleting friendship')
		}
	}

	async userExist (userId: number) : Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		if (user)
			return true
		return false
	}
}
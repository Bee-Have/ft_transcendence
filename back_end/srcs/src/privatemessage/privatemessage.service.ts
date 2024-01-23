import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { IncomingDirectMessage, OutgoingDirectMessage } from './dto/direct-message.dto';
import { Conversation, ConversationProps } from './dto/conversation.dto';
import { UserInfo, UserStatus } from 'src/user/gateway/dto/userStatus.dto';
import { Conversation as ConversationPrisma, DirectMessage} from '@prisma/client';
import { FriendshipService } from 'src/friendship/friendship.service';

@Injectable()
export class PrivateMessageService {

	constructor(private prisma: PrismaService,
		private userService: UserService,
		private friendshipService: FriendshipService) { }

	async getAllConvsAndLastMessage(userId: number): Promise<ConversationProps[]> {
		const convs = await this.getAllUserConversations(userId)
		const conversations: ConversationProps[] = new Array()

		for (const conv of convs)
			conversations.push(await this.buildConversationObject(userId, conv.id))

		return conversations
	}

	async getOrCreateConversation(userId: number, receiverId: number): Promise<ConversationProps> {

		if (userId === receiverId)
			throw new BadRequestException('User cannot create conversation with his self')

		const [lowestId, greaterId] = userId < receiverId ? [userId, receiverId] : [receiverId, userId];

		const conversation = await this.prisma.conversation.findFirst({
			where: {
				memberOneId: lowestId,
				memberTwoId: greaterId
			}
		})

		if (conversation)
			return await this.buildConversationObject(userId, conversation.id)

		try {
			const createdConv = await this.prisma.conversation.create({
				data: {
					memberOneId: lowestId,
					memberTwoId: greaterId
				}
			})

			const receiver: UserInfo = this.userService.connected_user_map.get(receiverId)

			if (receiver) {
				const receiverObject: ConversationProps = await this.buildConversationObject(receiverId, createdConv.id)
				receiver.socket.emit('new-conv', receiverObject)
			}

			return await this.buildConversationObject(userId, createdConv.id)
		}
		catch (err) {
			throw new BadRequestException('Error While Creation the Conversation')
		}
	}

	async createNewMessage(userId: number, message: IncomingDirectMessage): Promise<OutgoingDirectMessage> {
		let prvmsg: OutgoingDirectMessage
		const receiverId = await this.getFriendIdByConvId(userId, message.conversationId)
		const receiverBlockedSender: boolean = await this.friendshipService.isUserBlocked(receiverId, userId)

		try { 
			prvmsg = await this.createDirectMessage(
				userId,
				message.conversationId,
				message.content,
				receiverBlockedSender)

			if (!receiverBlockedSender){
				const receiver = this.userService.connected_user_map.get(receiverId)

				receiver?.socket.emit('new-message', prvmsg)
			}

			return prvmsg
		}
		catch (error) {
			console.log(error)
			throw new InternalServerErrorException('Posting message error')
		}
	}



	async getAllMessages(userId: number, conversationId: number): Promise<OutgoingDirectMessage[]> {
		const messages = await this.prisma.directMessage.findMany({
			where: {
				conversationId,
				NOT: {
					AND: [{ senderId: { not: userId } }, { isBlocked: true }]
				}
			},
			orderBy: {
				createdAt: 'asc'
			},
			select: {
				id: true,
				createdAt: true,
				content: true,
				isRead: true,
				senderId: true,
				conversationId: true,
				isBlocked: false
			}
		})

		return messages
	}

	async userCanAccessMessages(userId: number, conversationId: number): Promise<boolean> {
		const conversation = await this.prisma.conversation.findUnique({
			where: {
				id: conversationId
			}
		})

		if (!conversation)
			throw new NotFoundException('Conversation not found')

		return (conversation.memberOneId === userId || conversation.memberTwoId === userId)
	}

	async createDirectMessage(senderId: number, conversationId: number, content: string, isBlocked: boolean): Promise<OutgoingDirectMessage> {
		const message = await this.prisma.directMessage.create({
			data: {
				senderId,
				conversationId,
				content,
				isBlocked
			},
			select: {
				id: true,
				createdAt: true,
				content: true,
				isRead: true,
				senderId: true,
				conversationId: true,
				isBlocked: false
			}
		})

		return message
	}

	async getAllUserConversations(userId: number): Promise<ConversationPrisma[]> {
		const conversations = await this.prisma.conversation.findMany({
			where: {
				OR: [{ memberOneId: userId }, { memberTwoId: userId }]
			}
		})

		return conversations
	}

	async getLastMessage(userId: number, conversationId: number): Promise<OutgoingDirectMessage> {
		const lastMessage = await this.prisma.directMessage.findFirst({
			where: {
				conversationId,
				NOT: {
					AND: [{ senderId: { not: userId } }, { isBlocked: true }]
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: {
				id: true,
				createdAt: true,
				content: true,
				isRead: true,
				senderId: true,
				conversationId: true,
				isBlocked: false
			}
		})

		return lastMessage
	}

	async setMessagesAreRead(userId: number, conversationId: number): Promise<void> {
		await this.prisma.directMessage.updateMany({
			where: {
				conversationId: conversationId,
				senderId: { not: userId },
				isRead: { not: true }
			},
			data: {
				isRead: true
			}
		})
	}

	async getUsersofConversation(conversationId: number): Promise<number[]> {
		const conv = await this.prisma.conversation.findUnique({
			where: {
				id: conversationId
			}
		})

		if (!conv)
			throw new NotFoundException('Conv Not found')

		return [conv.memberOneId, conv.memberTwoId]
	}

	async getUsername(userId: number): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				username: true
			}
		})
		return user?.username
	}

	getFriendId(userId: number, conversation: ConversationPrisma): number {
		return userId === conversation.memberOneId ? conversation.memberTwoId : conversation.memberOneId
	}

	async getFriendIdByConvId(userId: number, conversationId: number): Promise<number> {
		const [memberOneId, memberTwoId] = await this.getUsersofConversation(conversationId)
	
		const conv: ConversationPrisma = {
			id: conversationId,
			memberOneId,
			memberTwoId
		}

		return this.getFriendId(userId, conv)
	}

	async getStatus(userId: number, receiverId: number) {
		const friendsId = await this.userService.getUserFriendsId(userId)

		if (!friendsId.includes(receiverId))
			return null
		
		const friend = this.userService.connected_user_map.get(receiverId)

		if (!friend)
			return UserStatus.offline
		return friend.userstatus
	}

	async buildConversationObject(userId: number, conversationId: number): Promise<ConversationProps> {
		const conversation: ConversationPrisma = await this.prisma.conversation.findUnique({
			where: {
				id: conversationId
			}
		})

		if (!conversation)
			throw new NotFoundException('Conversation Not found')

		const friendId = this.getFriendId(userId, conversation)

		const lastMessage = await this.getLastMessage(userId, conversationId)
		const friendUsername: string = await this.getUsername(friendId)
		const username: string = await this.getUsername(userId)

		const conv: Conversation = { 
			...conversation, 
			friendUsername,
			username,
			friendId,
			memberOneUsername: userId < friendId ? username : friendUsername,
			memberTwoUsername: userId < friendId ? friendUsername : username,
			isMemberBlockedByuser: await this.userService.isMemberOneBlockedByMemberTwo(friendId, userId),
			isMemberFriendWithUser: (await this.userService.getUserFriendsId(userId)).includes(friendId) || 
									!!(await this.userService.getUserSentInvite(userId)).filter(m => {return m.id === friendId}).length
		}

		const obj: ConversationProps = {
			conversation: conv,
			lastMessage,
			convIsUnRead: lastMessage ? (lastMessage.senderId != userId && !lastMessage.isRead) : false,
			userstatus: await this.getStatus(userId, friendId)
		}

		return obj
	}

	async isBlocked(userId, receiverId) { 
		return await this.friendshipService.isUserBlocked(userId, receiverId)
	}


}

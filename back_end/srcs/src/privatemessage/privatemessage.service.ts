import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { OutgoingDirectMessage } from './dto/direct-message.dto';

@Injectable()
export class PrivateMessageService {

	constructor(private prisma: PrismaService,
				private userService: UserService)
	{}

	async getAllConvsAndLastMessage(userId: number) {
		const conversations = await this.getAllUserConversations(userId)
		const convsAndMessage = new Array()

		for (const conversation of conversations) {
			const lastMessage = await this.getLastMessage(userId, conversation.id)
			convsAndMessage.push({conversation, lastMessage})
		}

		return convsAndMessage
	}

	async getOrCreateConversation(memberOneId: number, memberTwoId: number) {

		const [lowestId, greaterId] = memberOneId < memberTwoId ? [memberOneId, memberTwoId] : [memberTwoId, memberOneId];

		const conversation = await this.prisma.conversation.findFirst({
			where: {
				memberOneId: lowestId,
				memberTwoId: greaterId
			}
		})

		if (conversation)
			return conversation

		return await this.prisma.conversation.create({
			data: {
				memberOneId: lowestId,
				memberTwoId: greaterId
			}
		})
	}

	async getAllMessages(userId: number, conversationId: number) {
		const messages = await this.prisma.directMessage.findMany({
			where: {
				conversationId,
				NOT: {
					AND: [{senderId: {not: userId}}, {isBlocked: true}]
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

		return messages
	}

	async userCanAccessMessages(userId: number, conversationId: number) {
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

	async getAllUserConversations(userId: number) {
		const conversations = await this.prisma.conversation.findMany({
			where: {
				OR: [{ memberOneId: userId }, { memberTwoId: userId}]
			}
		})

		return conversations
	}

	async getLastMessage(userId:number, conversationId: number) {
		const lastMessage = await this.prisma.directMessage.findFirst({
			where: {
				conversationId,
				NOT: {
					AND: [{senderId: {not: userId}}, {isBlocked: true}]
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

	async setMessagesAreRead(userId: number, conversationId: number) {
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

	async getUsersofConversation(conversationId: number) {
		const conv = await this.prisma.conversation.findUnique({
			where: {
				id: conversationId
			}
		})

		return [conv.memberOneId, conv.memberTwoId]
	}

}

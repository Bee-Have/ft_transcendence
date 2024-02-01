import { Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { UserService } from 'src/user/user.service';
import { ConversationProps } from './dto/conversation.dto';
import { IncomingDirectMessage, OutgoingDirectMessage } from './dto/direct-message.dto';
import { PrivateMessageService } from './privatemessage.service';

@Controller('privatemessage')
export class PrivateMessageController {

	constructor(private privateMessageService: PrivateMessageService,
		private userService: UserService) { }

	@Get('conversations')
	async GetAllConvsAndLastMessage(@GetCurrentUser('sub') userId: number): Promise<ConversationProps[]> {
		return await this.privateMessageService.getAllConvsAndLastMessage(userId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('conversations/:receiverId')
	async handleconv(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number): Promise<ConversationProps> {
		return await this.privateMessageService.getOrCreateConversation(userId, receiverId)
	}

	@Get('messages/:conversationId')
	async handleGetssages(
		@Param('conversationId', ParseIntPipe) conversationId: number,
		@GetCurrentUser('sub') userId: number
	): Promise<OutgoingDirectMessage[]> {
		const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, conversationId)

		if (!userHaveRights)
			throw new ForbiddenException('You cannot access these messages')

		await this.privateMessageService.setMessagesAreRead(userId, conversationId)

		return await this.privateMessageService.getAllMessages(userId, conversationId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('messages')
	async handleCreateNeMessage(
		@MessageBody() message: IncomingDirectMessage,
		@GetCurrentUser('sub') userId: number): Promise<OutgoingDirectMessage> {

		const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, message.conversationId)

		if (!userHaveRights)
			throw new ForbiddenException('You cannot access these messages')
		while (message.content.includes("\n\n\n"))
			message.content = message.content.replace("\n\n\n", "\n\n")
		return await this.privateMessageService.createNewMessage(userId, message)

	}

	@Get('conversations/isread/:conversationId')
	async handleMessageIsRead(
		@Param("conversationId", ParseIntPipe) conversationId: number,
		@GetCurrentUser('sub') userId: number): Promise<void> {
		await this.privateMessageService.setMessagesAreRead(userId, conversationId)
	}

}

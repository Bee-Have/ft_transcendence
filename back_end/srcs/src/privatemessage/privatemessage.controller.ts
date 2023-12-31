import { Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Post, UnauthorizedException } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Public } from 'src/common/decorators';
import { UserService } from 'src/user/user.service';
import { IncomingDirectMessage, OutgoingDirectMessage } from './dto/direct-message.dto';
import { PrivateMessageService } from './privatemessage.service';
import { ConversationProps } from './dto/conversation.dto';

@Public()
@Controller('privatemessage')
export class PrivateMessageController {

	constructor(private privateMessageService: PrivateMessageService,
		private userService: UserService) { }

	// @Get('conversations')
	// async handleGetAllUserConversations(@GetCurrentUser('sub') userId: number){
	// 	return await this.privateMessageService.getAllUserConversations(userId)
	// }

	// @HttpCode(HttpStatus.OK)
	// @Post('conversations/:receiverId')
	// async handleGetOrCreateConversation(	@GetCurrentUser('sub') userId: number,
	// 								@Param('receiverId', ParseIntPipe) receiverId: number) {
	// 	return await this.privateMessageService.getOrCreateConversation(userId, receiverId)
	// }

	// @Get('messages/:conversationId')
	// async handleGetAllMessages(	@Param('conversationId', ParseIntPipe) conversationId: number,
	// 							@GetCurrentUser('sub') userId: number) {
	// 	const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, conversationId)

	// 	if (!userHaveRights)
	// 		throw new UnauthorizedException('You cannot access these messages')

	// 	return this.privateMessageService.getAllMessages(conversationId)
	// }

	// @HttpCode(HttpStatus.OK)
	// @Post('messages')
	// async handleCreateNewMessage(	@MessageBody() message: IncomingDirectMessage,
	// 								@GetCurrentUser('sub') userId: number) {
	// 	const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, message.conversationId)

	// 	if (!userHaveRights)
	// 		throw new UnauthorizedException('You cannot access these messages')

	// 	return await this.privateMessageService.createDirectMessage(
	// 		userId,
	// 		message.conversationId,
	// 		message.content,
	// 		false
	// 	)
	// }

	//////////////////////////TEST//////////////////////////////////

	@Get('conversations/:userId')
	async handlewef(@Param('userId', ParseIntPipe) userId: number): Promise<ConversationProps[]> {
		return await this.privateMessageService.getAllConvsAndLastMessage(userId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('conversations/:userId/:receiverId')
	async handleconv(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number): Promise<ConversationProps> {
		return await this.privateMessageService.getOrCreateConversation(userId, receiverId)
	}

	@Get('messages/:userId/:conversationId')
	async handleGetssages(@Param('conversationId', ParseIntPipe) conversationId: number,
		@Param('userId', ParseIntPipe) userId: number): Promise<OutgoingDirectMessage[]> {
		const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, conversationId)

		if (!userHaveRights)
			throw new UnauthorizedException('You cannot access these messages')

		await this.privateMessageService.setMessagesAreRead(userId, conversationId)

		return await this.privateMessageService.getAllMessages(userId, conversationId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('messages/:userId')
	async handleCreateNeMessage(
		@MessageBody() message: IncomingDirectMessage,
		@Param('userId', ParseIntPipe) userId: number): Promise<OutgoingDirectMessage> {

		const userHaveRights = await this.privateMessageService.userCanAccessMessages(userId, message.conversationId)

		if (!userHaveRights)
			throw new UnauthorizedException('You cannot access these messages')

		return await this.privateMessageService.createNewMessage(userId, message)

	}

	@Get('test/:userId/:conversationId')
	async wigf(
		@Param("conversationId", ParseIntPipe) conversationId: number,
		@Param("userId", ParseIntPipe) userId: number): Promise<OutgoingDirectMessage> {
		return await this.privateMessageService.getLastMessage(userId, conversationId)
	}

	@Get('conversations/isread/:userId/:conversationId')
	async handleMessageIsRead(
		@Param("conversationId", ParseIntPipe) conversationId: number,
		@Param("userId", ParseIntPipe) userId: number): Promise<void> {
		await this.privateMessageService.setMessagesAreRead(userId, conversationId)
	}

}

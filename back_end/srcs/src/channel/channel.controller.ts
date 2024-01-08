import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { CreateChannelDto } from './dto/CreateChannel.dto';
import { IncomingChannelMessage } from './dto/IncomingChannelMessage.dto';
import { RestrictChannelMember } from './dto/RestrictChannelMember.dto';

@Public()
@Controller('channel')
export class ChannelController {

	constructor(private channelService: ChannelService) { }

	// @Post()
	// @HttpCode(HttpStatus.OK)
	// async CreateChannel(
	// 	@GetCurrentUser('sub') userId: number,
	// 	@Body() body: CreateChannelDto) {
	// 	await this.channelService.createChannel(userId, body)
	// }

	// @Get()
	// async GetAllChannelOfUser(@GetCurrentUser('sub') userId: number) {
	// 	return await this.channelService.getAllChannels(userId)
	// }

	// @Get('messages/:channelId') 
	// async GetAllChannelMessages(
	// 	@GetCurrentUser('sub') userId: number,
	// 	@Param('channelId', ParseIntPipe) channelId: number) {
	// 	return await this.channelService.getChannelMessages(userId, channelId)
	// }

	// @Post('messages')
	// @HttpCode(HttpStatus.OK)
	// async CreateChannelMessage(
	// 	@GetCurrentUser('sub') userId: number,
	// 	@Body() message: IncomingChannelMessage
	// ) {
	// 	await this.channelService.createNewMessage(userId, message)
	// }

	@Post('restrict')
	@HttpCode(HttpStatus.OK)
	async RestrictMember(
		@GetCurrentUser('sub') userId: number,
		@Body() body: RestrictChannelMember
	) {
		await this.channelService.restrictChannelMember(userId, body)
	}

	@Post(':userId')
	@HttpCode(HttpStatus.OK)
	async CreateChannel(
		@Param('userId', ParseIntPipe) userId: number,
		@Body() body: CreateChannelDto) {
		await this.channelService.createChannel(userId, body)
	}

	@Get(':userId')
	async GetAllChannelOfUser(
		@Param('userId', ParseIntPipe) userId: number) {
		return await this.channelService.getAllChannels(userId)
	}

	@Get('messages/:userId/:channelId')
	async GetAllChannelMessages(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('channelId', ParseIntPipe) channelId: number): Promise<any> {
		return await this.channelService.getChannelMessages(userId, channelId)
	}

	@Get('members/:userId/:channelId')
	async GetAllChannelMembers(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('channelId', ParseIntPipe) channelId: number) {
		return await this.channelService.getAllChannelMembers(userId, channelId)
	}

	@Post('messages/:userId')
	@HttpCode(HttpStatus.OK)
	async CreateChannelMessage(
		@Param('userId', ParseIntPipe) userId: number,
		@Body() message: IncomingChannelMessage) {
		await this.channelService.createNewMessage(userId, message)
	}



}

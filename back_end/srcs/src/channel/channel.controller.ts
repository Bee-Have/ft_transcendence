import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { CreateChannelDto } from './dto/CreateChannel.dto';
import { IncomingChannelMessage } from './dto/IncomingChannelMessage.dto';
import { RestrictChannelMember } from './dto/RestrictChannelMember.dto';
import { JoinPrivateChannelDto, JoinProtectedChannelDto, JoinPublicChannelDto } from './dto/JoinChannel.dto';

@Public()
@Controller('channel')
export class ChannelController {

	constructor(private channelService: ChannelService) { }

	@Post('update/:channelId')
	@HttpCode(HttpStatus.OK)
	async UpdateChannel(
		@GetCurrentUser('sub') userId: number,
		@Body() body: CreateChannelDto,
		@Param('channelId', ParseIntPipe) channelId: number
	) {
		await this.channelService.updateChannel(userId, channelId, body)
	}

	@Post('join/public')
	@HttpCode(HttpStatus.OK)
	async JoinPublicChannel(
		@GetCurrentUser('sub') userId: number,
		@Body() body: JoinPublicChannelDto,
	) {
		await this.JoinPublicChannel(userId, body)
	}

	@Post('join/protected')
	@HttpCode(HttpStatus.OK)
	async JoinProtectedChannel(
		@GetCurrentUser('sub') userId: number,
		@Body() body: JoinProtectedChannelDto,
	) {
		await this.JoinProtectedChannel(userId, body)
	}

	@Post('join/private')
	@HttpCode(HttpStatus.OK)
	async JoinPrivateChannel(
		@GetCurrentUser('sub') userId: number,
		@Body() body: JoinPrivateChannelDto,
	) {
		await this.JoinPrivateChannel(userId, body)
	}

	@Get('secret/update/:channelId')
	async UpdatePrivateChannelSecret(
		@GetCurrentUser('sub') userId: number,
		@Param('channelId', ParseIntPipe) channelId: number
	) {
		return await this.channelService.changePrivateChannelSecret(userId, channelId)
	}

	@Get('secret/:channelId')
	async GetPrivateChannelSecret(
		@GetCurrentUser('sub') userId: number,
		@Param('channelId', ParseIntPipe) channelId: number
	) {
		return await this.channelService.getChannelSecret(userId, channelId)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	async CreateChannel(
		@GetCurrentUser('sub') userId: number,
		@Body() body: CreateChannelDto) {
		await this.channelService.createChannel(userId, body)
	}

	@Get()
	async GetAllChannelOfUser(@GetCurrentUser('sub') userId: number) {
		return await this.channelService.getAllChannels(userId)
	}

	@Get('messages/:channelId') 
	async GetAllChannelMessages(
		@GetCurrentUser('sub') userId: number,
		@Param('channelId', ParseIntPipe) channelId: number) {
		return await this.channelService.getChannelMessages(userId, channelId)
	}

	@Post('messages')
	@HttpCode(HttpStatus.OK)
	async CreateChannelMessage(
		@GetCurrentUser('sub') userId: number,
		@Body() message: IncomingChannelMessage
	) {
		await this.channelService.createNewMessage(userId, message)
	}

	@Post('restrict')
	@HttpCode(HttpStatus.OK)
	async RestrictMember(
		@GetCurrentUser('sub') userId: number,
		@Body() body: RestrictChannelMember
	) {
		await this.channelService.restrictChannelMember(userId, body)
	}

	@Get('members/:channelId')
	async GetAllChannelMembers(
		@GetCurrentUser('sub') userId: number,
		@Param('channelId', ParseIntPipe) channelId: number) {
		return await this.channelService.getAllChannelMembers(userId, channelId)
	}


}

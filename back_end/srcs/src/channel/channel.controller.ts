import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { CreateChannelDto } from './dto/CreateChannel.dto';

// @Public()
@Controller('channel')
export class ChannelController {

	constructor(private channelService: ChannelService) {}

	@Get('messages/:id') 
	async GetAllChannelMessages(
		@GetCurrentUser('sub') userId: number,
		@Param('id', ParseIntPipe) channelId: number) {
		return await this.channelService.getChannelMessages(userId, channelId)
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

}

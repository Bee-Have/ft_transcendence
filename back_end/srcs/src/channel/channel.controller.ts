import { Controller, Get } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Public } from 'src/common/decorators';

@Public()
@Controller('channel')
export class ChannelController {

	constructor(private channelService: ChannelService) {}

	// @Get('channel/messages/:id')
	// async 


}

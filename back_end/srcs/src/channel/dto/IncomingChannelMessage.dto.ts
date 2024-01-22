import { IsNotEmpty, IsNumber } from "class-validator";

export class IncomingChannelMessage {
	@IsNumber()
	channelId: number

	@IsNotEmpty()
	content: string

}
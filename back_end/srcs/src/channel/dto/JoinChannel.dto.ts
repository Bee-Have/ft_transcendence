import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class JoinPrivateChannelDto {

	@IsString()
	@IsNotEmpty()
	secret: string
}

export class JoinPublicChannelDto {

	@IsNumber()
	channelId: number
}

export class JoinProtectedChannelDto {

	@IsNumber()
	channelId: number

	@IsString()
	@IsNotEmpty()
	password: string
}
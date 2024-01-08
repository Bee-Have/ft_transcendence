import { ChannelMemberState } from "@prisma/client";
import { IsDefined, IsEnum, IsNumber } from "class-validator";


export class RestrictChannelMember {

	@IsEnum(ChannelMemberState)
	restriction: ChannelMemberState

	@IsNumber()
	@IsDefined()
	channelId: number

	@IsNumber()
	@IsDefined()
	restrictedUserId: number

}
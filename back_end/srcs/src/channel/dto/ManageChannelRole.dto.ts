import { IsEnum, IsNumber } from "class-validator";

enum ChannelRole {
	ADMIN = "ADMIN",
	NONADMIN = "NONADMIN"
}


export class ManageChannelRole {
	@IsNumber()
	channelId: number

	@IsEnum(ChannelRole)
	role: ChannelRole

	@IsNumber()
	memberId: number
}
import { ChannelMode } from "@prisma/client"
import { IsEnum, IsString, Length } from "class-validator"

export function RespectPasswordPolicy (password: string) {
	if (
		password.length < 8 ||
		password.search(/[A-Z]/) == -1 ||
		password.search(/[a-z]/) == -1 ||
		password.search(/[0-9]/) == -1
	)
		return false
	return true
}


export class CreateChannelDto {
	
	@Length(3, 50)
	@IsString()
	name: string

	password?: string
	
	passwordConfirm? : string

	@IsEnum(ChannelMode)
	mode: ChannelMode
}
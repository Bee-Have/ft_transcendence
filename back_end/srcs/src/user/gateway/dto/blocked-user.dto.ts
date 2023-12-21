import { IsNumber } from "class-validator";

export class BlockedUserDto {

	@IsNumber()
	blokedUserId: number
}
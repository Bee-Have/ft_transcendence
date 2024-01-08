import { IsNumber } from "class-validator";

export class BlockedUserDto {

	@IsNumber()
	blockedUserId: number
}
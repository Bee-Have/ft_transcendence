import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GameMatchmakingDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;
}

export class SendInviteDto {
	@IsNotEmpty()
	@IsNumber()
	invitedUserId: number;

	@IsNotEmpty()
	@IsString()
	gameMode: string;
}
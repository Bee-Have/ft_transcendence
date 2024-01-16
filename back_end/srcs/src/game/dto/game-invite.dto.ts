import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserStatus } from "src/user/gateway/dto/userStatus.dto";

export class GameMatchmakingDto {
	@IsNotEmpty()
	@IsString()
	gameMode: string;
}

export class SendInviteDto {
	@IsNotEmpty()
	@IsNumber()
	invitedUserId: number;

	@IsNotEmpty()
	@IsString()
	gameMode: string;
}

export class DeclineInviteDto {
	@IsNotEmpty()
	@IsNumber()
	declinedUserId: number;
}

export class AcceptInviteDto {
	@IsNotEmpty()
	@IsNumber()
	acceptedUserId: number;
}

export class InviteDto {
	sender: {id: number, username: string, userstatus: UserStatus, photo: string};
	receiver?: {id: number, username: string, userstatus: UserStatus, photo: string};
	gameMode: string;
	acceptedInvite: boolean;
}

export class RunningGameDto {
	player1Id: number;
	player2Id: number;

	gameMode: string;
}
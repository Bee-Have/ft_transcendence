import { IsNotEmpty, IsNumber } from "class-validator";

export class GameMatchmakingDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;
}
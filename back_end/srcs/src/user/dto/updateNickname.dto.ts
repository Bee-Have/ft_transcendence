import { IsDefined, Length } from "class-validator";

export class updateNicknameDto {
	@Length(3, 10)
	@IsDefined()
	nickname: string
}

export class updateUserDescriptionDto {
	@IsDefined()
	description: string
}
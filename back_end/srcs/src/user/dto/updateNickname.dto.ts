import { IsDefined, Length } from "class-validator";

export class updateNicknameDto {
	@Length(3, 20)
	@IsDefined()
	nickname: string
}

export class updateUserDescriptionDto {
	@IsDefined()
	description: string
}
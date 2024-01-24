import { IsDefined, Length } from "class-validator";

export class updateUsernameDto {
	@Length(3, 20)
	@IsDefined()
	username: string
}

export class updateUserDescriptionDto {
	@IsDefined()
	description: string
}
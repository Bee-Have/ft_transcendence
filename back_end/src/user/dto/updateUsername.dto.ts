import { IsDefined } from "class-validator";

export class updateUsernameDto {
	@IsDefined()
	username: string
}
import { IsDefined, IsNotEmpty } from "class-validator"


export class AuthDto {
	@IsDefined()
	@IsNotEmpty()
	state: string
	
	@IsDefined()
	@IsNotEmpty()
	code: string
}
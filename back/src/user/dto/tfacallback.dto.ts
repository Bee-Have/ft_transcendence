import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class tfaCallbackDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	code: string
}
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class TfaDto {
	@IsDefined()
	@IsNotEmpty()
	@ApiProperty({
		description: 'The Google Authenticator 6 digits code that the user need to provide'
	})
	code: string 
}
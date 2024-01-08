import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumberString, Length } from "class-validator";

export class TfaDto {
	@IsDefined()
	@IsNumberString()
	@Length(6, 6, {message: 'code must have 6 digits'})
	@ApiProperty({
		description: 'The Google Authenticator 6 digits code that the user need to provide'
	})
	code: string 
}
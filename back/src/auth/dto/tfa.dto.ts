import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class TfaDto {
	@IsDefined()
	@IsNotEmpty()
	@ApiProperty({
		description: 'The code '
	})
	code: string 
}
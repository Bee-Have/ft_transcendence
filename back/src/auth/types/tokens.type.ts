import { ApiProperty } from "@nestjs/swagger"

export type Tokens = {
	access_token: string
	refresh_token: string
}

export class TokensDto {
	@ApiProperty()
	access_token: string
	@ApiProperty()
	refresh_token: string
}
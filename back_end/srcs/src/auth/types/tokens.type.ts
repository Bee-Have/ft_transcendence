import { ApiProperty } from "@nestjs/swagger"

export type Tokens = {
	access_token: string
	refresh_token: string
	payload_cookie: {}
}

export class TokensDto {
	@ApiProperty()
	access_token: string
	@ApiProperty()
	refresh_token: string
}
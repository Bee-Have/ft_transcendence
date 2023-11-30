import { Expose } from "class-transformer"

export class FtApiUserDto {
	@Expose()
	id: number

	@Expose()
	login: string
	
	@Expose()
	email: string
	
	@Expose()
	image: object

}

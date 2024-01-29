import { Expose } from "class-transformer"

export class userEditProfileDto {
    @Expose()
    realname: string

    @Expose()
    username: string

	@Expose()
	isTwoFAEnable: boolean

    @Expose()
    description: string

    //add avatar + achievement
}
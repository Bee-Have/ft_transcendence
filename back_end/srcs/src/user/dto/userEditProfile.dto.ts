import { Expose } from "class-transformer"

export class userEditProfileDto {
    @Expose()
    username: string

    @Expose()
    nickname: string

	@Expose()
	isTwoFAEnable: boolean

    @Expose()
    description: string

    //add avatar + achievement
}
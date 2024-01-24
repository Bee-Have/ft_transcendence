import { Expose } from "class-transformer"

export class userEditProfileDto {
    @Expose()
    username: string

    @Expose()
    score: number

    @Expose()
    win: number

    @Expose()
    loose: number

	@Expose()
	isTwoFAEnable: boolean

    //add avatar + achievement
}
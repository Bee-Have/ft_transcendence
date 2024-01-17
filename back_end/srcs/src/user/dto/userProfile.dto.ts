import { Expose } from "class-transformer"

export class userProfileDto {
    @Expose()
    username: string

    @Expose()
    nickname: string

    @Expose()
    score: number

    @Expose()
    win: number

    @Expose()
    loose: number

    @Expose()
    description: string

    //add avatar + achievement
}
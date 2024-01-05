import { Expose } from "class-transformer"

export class userProfileDto {
    @Expose()
    username: string

    @Expose()
    score: number

    @Expose()
    win: number

    @Expose()
    loose: number

    //add avatar + achievement
}
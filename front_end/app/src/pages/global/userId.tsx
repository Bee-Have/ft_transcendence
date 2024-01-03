import { ReadCookie } from "../ReadCookie"

const userID: string | null  = ReadCookie('userId')

export const userId: number = Number(userID)
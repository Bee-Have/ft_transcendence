import { ReadCookie } from "../ReadCookie"

const userID: any  = ReadCookie('userId')

export const userId: number = Number(userID)
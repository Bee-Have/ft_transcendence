import { ReadCookie } from "../../components/ReadCookie"

const userID: string | null  = ReadCookie('userId')

export const userId: number = Number(userID)
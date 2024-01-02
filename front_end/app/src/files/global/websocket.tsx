import { io } from "socket.io-client"
import { ReadCookie } from "../ReadCookie"

const userID: string | null  = ReadCookie('userId')

export const socket = userID ? io('http://localhost:3001/user', { extraHeaders: { id: userID } }) : null
//TODO: Give the access_token as header
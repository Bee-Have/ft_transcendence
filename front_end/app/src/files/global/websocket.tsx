import { io } from "socket.io-client"
import { ReadCookie } from "../ReadCookie"

const userID: any  = ReadCookie('userId')

export const socket = io('http://localhost:3001/user', { extraHeaders: { id: userID } })
//TODO: Give the access_token as header

import { io } from "socket.io-client"
import { ReadCookie } from "../../components/ReadCookie"
import { BACKEND_URL } from "./env"

const userID: string | null  = ReadCookie('userId')

export const socket = userID ? io(BACKEND_URL + '/user', { extraHeaders: { id: userID } }) : null
//TODO: Give the access_token as header
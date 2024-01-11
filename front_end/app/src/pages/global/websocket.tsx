import { io } from "socket.io-client"
import { ReadCookie } from "../../components/ReadCookie"
import { BACKEND_URL } from "./env"

const atToken: string | null  = ReadCookie('access_token')

export const socket = atToken ? io(BACKEND_URL + '/user', { extraHeaders: { id: atToken } }) : null
//TODO: Give the access_token as header
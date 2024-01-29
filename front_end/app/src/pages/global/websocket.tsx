// import { io } from "socket.io-client"
// import { ReadCookie } from "../../components/ReadCookie"
// import { BACKEND_URL } from "./env"

// const atToken: string | null  = ReadCookie('access_token')

// export let socket = atToken ? io(BACKEND_URL + '/user', { extraHeaders: { id: atToken } }) : null

// export function resetSocket () {
// 	const ATToken: string | null  = ReadCookie('access_token')

// 	if (socket === null)
// 		socket = ATToken ? io(BACKEND_URL + '/user', { extraHeaders: { id: ATToken } }) : null
// } 	
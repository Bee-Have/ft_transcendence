import { verify } from 'jsonwebtoken'
import { Socket } from 'socket.io'

// type SocketIOMiddleware = {
// 	(client: Socket, next: (err?: Error) => void)
// }

export const SocketAuthMiddleware = () => {
	return (client:Socket , next) => {
		try {
			const tk: string = String(client.handshake.headers.id)
			client.data = verify(tk, process.env.JWT_AT_SECRET)
			next()
		}
		catch (error) {
			console.log(error)
			next(error)
		}
	}
}

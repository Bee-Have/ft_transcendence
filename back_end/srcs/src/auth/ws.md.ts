import { Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'

// type SocketIOMiddleware = {
// 	(client: Socket, next: (err?: Error) => void)
// }

export const SocketAuthMiddleware = () => {
	return (client:Socket , next) => {
		try {
			const tk = client.handshake.headers.authorization.split(' ')[1]
			client.data = verify(tk, process.env.JWT_AT_SECRET)
			next()
		}
		catch (error) {
			next(error)
		}
	}
}

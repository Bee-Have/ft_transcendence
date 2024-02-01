import { verify } from 'jsonwebtoken'
import { Socket } from 'socket.io'

export const SocketAuthMiddleware = () => {
	return (client:Socket , next) => {
		try {
			const tk: string = String(client.handshake.headers.id)
			client.data = verify(tk, process.env.JWT_AT_SECRET)
			next()
		}
		catch (error) {
			next(error)
		}
	}
}

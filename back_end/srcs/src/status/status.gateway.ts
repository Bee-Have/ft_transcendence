import { OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConnectedSocket, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketAuthMiddleware } from 'src/auth/ws.md';
import { PrismaService } from 'src/prisma/prisma.service';

class UserStatus {
	status = Status.online

}

enum Status {
	online,
	offline,
	ingame
}

class StatusRoom{
	
	user_map: Map<number, UserStatus>
	room_map: Map<number, Array<number>>

	add_user(id: number, friends_arr: Array<number>){
		this.user_map.set(id, new UserStatus())


		// if ()
	}

	update_user_status(id: number, status: Status) {
		const stat = this.user_map.get(id)
		stat.status = status
	}

	remove_user(id: number) {
		this.user_map.delete(id)
	}


}


@WebSocketGateway({ namespace: 'user/status' })
export class StatusGateway implements OnModuleInit, OnModuleDestroy{
	
	constructor(private prisma: PrismaService) {}

	@WebSocketServer()
	server: Server

	// afterInit(client: Socket) {
	// 	client.use(SocketAuthMiddleware() as any)
	// }

	handleConnection(@ConnectedSocket() clientt: Socket) {

		clientt.on('disconnect', () => {
			console.log('disconnect')

		})

	}


	onModuleInit() {
		this.server.on('connection', async (client) => {
			
			const user = await this.prisma.user.findUnique({
				where: {
					id: Number(client.handshake.headers.id)
				},
				select: {
					id: true,
					friends: {
						select: {
							id: true
						}
					}
				}
			})

			console.log(user)


			// this.server.socketsJoin(client.handshake.headers.id)
			client.join("4")
			client.join("2")


			const sockets = await this.server.in("4").fetchSockets()
			
			sockets.forEach((v) => {
				console.log(v.id)
			})

		})
	}

	onModuleDestroy() {
		console.log('destroy')
	}


}

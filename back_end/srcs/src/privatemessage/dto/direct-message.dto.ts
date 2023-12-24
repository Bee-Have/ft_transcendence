import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class IncomingDirectMessage {

	@IsNumber()
	conversationId: number

	@IsNumber()
	receiverId: number

	@IsNotEmpty()
	content: string

}

export class OutgoingDirectMessage {
	@Expose()
	id: number

	@Expose()
	conversationId: number

	@Expose()
	senderId: number

	@Expose()
	createdAt: Date

	@Expose()
	content: string

	@Expose()
	isRead: boolean
}
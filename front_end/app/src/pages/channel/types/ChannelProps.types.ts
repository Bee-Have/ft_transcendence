export interface ChannelProps {
	channelName: string
	mode: "PUBLIC" | "PROTECTED"
	id: number
	ownerId: number
	ownerUsername: string
	members: number
}
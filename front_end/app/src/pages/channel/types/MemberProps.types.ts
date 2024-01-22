export interface MemberProps {
	userId: number,
	memberId: number,
	role: string,
	state: string,
	channelId: number,
	username: string,
	channelName: string,
	isMemberBlockedByuser: boolean,
	isMemberFriendWithUser: boolean
}
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChannelMember } from '@prisma/client';
import { hash } from 'argon2';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateChannelDto, RespectPasswordPolicy } from './dto/CreateChannel.dto';
import { IncomingChannelMessage } from './dto/IncomingChannelMessage.dto';
import { RestrictChannelMember } from './dto/RestrictChannelMember.dto';

@Injectable()
export class ChannelService {

	constructor(
		private prisma: PrismaService,
		private userService: UserService) { }


	async getChannelMessages(userId: number, channelId: number) {
		if (! await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		if (! await this.isUserChannelMember(userId, channelId))
			throw new ForbiddenException('You are not member of this channel')

		const messages = await this.prisma.channel.findUnique({
			where: {
				id: channelId
			},
			select: {
				messages: true
			}
		})
		const trim = new Array()

		for (const message of messages.messages) {
			const messageUserId = await this.getUserIdByMemberId(message.senderId)
			trim.push({
				...message,
				senderMemberId: message.senderId,
				senderUserId: messageUserId,
				username: await this.userService.getUsername(messageUserId)
			})
		}

		return trim
	}

	async createChannel(userId: number, body: CreateChannelDto) {
		if (await this.channelNameExist(body.name))
			throw new BadRequestException('Channel name already exist')

		let password: string | null = null

		if (body.mode === "PROTECTED") {
			if (!body.password || !body.passwordConfirm)
				throw new BadRequestException('Password must be defined')
			if (body.password !== body.passwordConfirm)
				throw new BadRequestException('Passwords does not match')
			if (!RespectPasswordPolicy(body.password))
				throw new BadRequestException('Password does not respest password policy')

			password = await hash(body.password)
		}
		else if (body.mode === "PRIVATE")
			password = authenticator.generateSecret(60)

		try {
			const channel = await this.prisma.channel.create({
				data: {
					mode: body.mode,
					channelName: body.name,
					password,
					members: {
						create: [
							{
								userId,
								role: "OWNER",
							}
						]
					}
				}
			})

			return { channelId: channel.id, channelName: channel.channelName }
		}
		catch (e) {
			console.log('Could not create the channel', e)
			throw new InternalServerErrorException('Could not create the channel')
		}

	}

	async getAllChannels(userId: number) {
		const channelMembers = await this.prisma.channelMember.findMany({
			where: {
				userId
			}
		})

		const channels = new Array()

		for (const member of channelMembers) {
			if (member.state !== "BANNED")
				channels.push({
					name: await this.getChannelName(member.channelId),
					mode: await this.getChannelMode(member.channelId),
					id: member.channelId,
					state: member.state,
					role: member.role,
					ownerId: await this.getChannelOwnerId(member.channelId)
				})
		}

		return channels
	}

	async createNewMessage(userId: number, message: IncomingChannelMessage) {
		const senderMember = await this.getChannelMember(userId, message.channelId)

		if (senderMember.state !== "REGULAR")
			throw new ForbiddenException('You can not send messages to this Channel')

		try {
			const outgoingMessage = await this.prisma.channelMessage.create({
				data: {
					content: message.content,
					senderId: senderMember.id,
					channelId: message.channelId
				}
			})

			const members = await this.getMembersofChannel(message.channelId)

			for (const member of members) {
				if (member.state === "BANNED")
					continue

				const member_in_map = this.userService.connected_user_map.get(member.userId)

				member_in_map?.socket.emit('new-channel-message',
					{
						...outgoingMessage,
						senderUserId: senderMember.userId,
						senderMemberId: senderMember.id,
						username: await this.userService.getUsername(senderMember.userId)
					})
			}
		} catch (e) {
			console.log(e)
			throw new InternalServerErrorException('Could not create channel message')
		}
	}

	async getAllChannelMembers(userId: number, channelId: number) {
		if (!await this.isUserChannelMember(userId, channelId))
			throw new ForbiddenException('You are not a member of this channel')

		const members = await this.getMembersofChannel(channelId)

		const trim = new Array()

		for (const member of members) {
			if (member.state !== "BANNED")
				trim.push({
					userId: member.userId,
					memberId: member.id,
					role: member.role,
					state: member.state,
					channelId: member.channelId,
					username: await this.userService.getUsername(member.userId),
					channelName: await this.getChannelName(channelId)
				})
		}

		return trim
	}

	async restrictChannelMember(userId: number, body: RestrictChannelMember) {
		if (body.restriction === "MUTED")
			await this.muteUser(userId, body.restrictedUserId, body.channelId)
		if (body.restriction === "BANNED")
			await this.banUser(userId, body.restrictedUserId, body.channelId)
		if (body.restriction === "KICKED")
			await this.kickUser(userId, body.restrictedUserId, body.channelId)
	}


	async muteUser(userId: number, mutedUserId: number, channelId: number) {
		const restrictedUser = await this.userCanRestrictUser(userId, mutedUserId, channelId)

		await this.prisma.channelMember.update({
			where: {
				id: restrictedUser.id
			},
			data: {
				muteDate: new Date(Date.now() + (1000 * 5 * 60))
			}
		})
	}

	async banUser(userId: number, bannedUserId: number, channelId: number ) {
		const restrictedUser = await this.userCanRestrictUser(userId, bannedUserId, channelId)

		await this.prisma.channelMember.update({
			where: {
				id: restrictedUser.id
			},
			data: {
				state: "BANNED"
			}
		})
	}

	async kickUser(userId: number, kickedUserId: number, channelId: number ) {
		const restrictedUser = await this.userCanRestrictUser(userId, kickedUserId, channelId)

		await this.prisma.channelMember.delete({
			where: {
				id: restrictedUser.id
			}
		})
	}

	async userCanRestrictUser(userId: number, restrictedUserId: number, channelId: number): Promise<ChannelMember>
	{
		const user = await this.getChannelMember(userId, channelId)
		const restrictUser = await this.getChannelMember(restrictedUserId, channelId)

		if (restrictUser.role === "OWNER")
			throw new ForbiddenException('Cannot restrict the Owner of the channel')

		if (user.role === "NONADMIN")
			throw new ForbiddenException('Only Admin or Owner can restrict a channel member')

		return restrictUser
	}

	async getMembersofChannel(channelId: number) {
		const members = await this.prisma.channelMember.findMany({
			where: {
				channelId
			}
		})

		if (!members)
			throw new InternalServerErrorException('Error while requesting members of channel')

		return members
	}

	async channelNameExist(channelName: string) {
		const channel = await this.prisma.channel.count({
			where: {
				channelName
			}
		})

		if (channel)
			return true
		return false
	}

	async isUserChannelMember(userId: number, channelId: number): Promise<Boolean> {
		if (!await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		const member = await this.prisma.channelMember.count({
			where: {
				userId,
				channelId
			}
		})

		if (member)
			return true
		return false
	}

	async getChannelMember(userId: number, channelId: number) {
		if (!await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		const member = await this.prisma.channelMember.findFirst({
			where: {
				userId,
				channelId
			}
		})

		if (!member)
			throw new ForbiddenException('User is not in this Channel')

		return member
	}

	async channelExist(channelId: number): Promise<Boolean> {
		const channel = await this.prisma.channel.count({
			where: {
				id: channelId
			}
		})

		if (channel)
			return true
		return false
	}

	async getChannelName(channelId: number) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			return channel.channelName
		}
		catch (e) {
			throw new InternalServerErrorException('Error getting channel Name')
		}
	}

	async getChannelMode(channelId: number) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			return channel.mode
		}
		catch (e) {
			throw new InternalServerErrorException('Error getting channel Mode')
		}
	}

	async getChannel(channelId: number) {
		if (!await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		return await this.prisma.channel.findUnique({
			where: {
				id: channelId
			}
		})
	}

	async getUserIdByMemberId(memberId: number) {
		const member = await this.prisma.channelMember.findUnique({
			where: {
				id: memberId
			}
		})
		return member.userId
	}

	async getChannelOwnerId(channelId: number) {
		const members = await this.getMembersofChannel(channelId)

		for(const member of members) {
			if (member.role === "OWNER")
				return member.userId
		}

		throw new NotFoundException("Channel Not Found")
	}
}

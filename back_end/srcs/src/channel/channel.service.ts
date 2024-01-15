import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChannelMember } from '@prisma/client';
import { hash, verify } from 'argon2';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateChannelDto, RespectPasswordPolicy } from './dto/CreateChannel.dto';
import { IncomingChannelMessage } from './dto/IncomingChannelMessage.dto';
import { JoinPrivateChannelDto, JoinProtectedChannelDto, JoinPublicChannelDto } from './dto/JoinChannel.dto';
import { RestrictChannelMember } from './dto/RestrictChannelMember.dto';
var sizeOf = require('buffer-image-size');
import * as fs from 'fs';
import { ManageChannelRole } from './dto/ManageChannelRole.dto';
import { Response } from "express";

@Injectable()
export class ChannelService {

	constructor(
		private prisma: PrismaService,
		private userService: UserService) { }

	async getChannelsList(userId: number) {
		const channels = await this.prisma.channel.findMany({
			where: {
				NOT: {
					mode: "PRIVATE"
				},
			},
			select:{
				id: true,
				channelName: true,
				mode: true
			}
		})

		const trim = new Array()

		for (const channel of channels) {
			if (!await this.getChannelMemberNotThrow(userId, channel.id)) {
				const ownerId = await this.getChannelOwnerId(channel.id)

				trim.push({
					...channel,
					ownerId,
					ownerUsername: await this.userService.getUsername(ownerId),
					members: await this.countMemberOfChannels(channel.id)
				})
			}
		}

		return trim
	}

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

			if (! await this.userService.doMemberOneBlockedMemberTwo(userId, messageUserId))
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

	async updateChannel(userId: number, channelId: number, body: CreateChannelDto) {
		const channel = await this.getChannel(channelId)
		const member = await this.getChannelMember(userId, channelId)

		if (member.role !== "OWNER")
			throw new ForbiddenException('You have no rigths for this channel')
		
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

		await this.prisma.channel.update({
			where: {
				id: channelId
			},
			data: {
				password,
				channelName: body.name,
				mode: body.mode
			}
		})
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

	async joinProtectedChannel(userId: number, body: JoinProtectedChannelDto) {
		const channel = await this.getChannel(body.channelId)
		const member = await this.getChannelMemberNotThrow(userId, body.channelId)

		if (channel.mode !== "PROTECTED")
			throw new BadRequestException('Wrong channel')
		if (member?.state === "BANNED")
			throw new ForbiddenException('You are Banned from this channel')
		if (member)
			throw new BadRequestException('You already are a member of this channel')

		const bool = await verify(channel.password, body.password)

		if (bool) {
			await this.prisma.channelMember.create({
				data: {
					channelId: channel.id ,
					userId,
					role: "NONADMIN",
					state: "REGULAR"
				} 
			})
		}
		else
			throw new ForbiddenException("Wrong password")
	}

	async joinPublicChannel(userId: number, body: JoinPublicChannelDto) {
		const channel = await this.getChannel(body.channelId)
		const member = await this.getChannelMemberNotThrow(userId, body.channelId)

		if (channel.mode !== "PUBLIC")
			throw new BadRequestException('Wrong channel')
		if (member?.state === "BANNED")
			throw new ForbiddenException('You are Banned from this channel')
		if (member)
			throw new BadRequestException('You already are a member of this channel')

		await this.prisma.channelMember.create({
			data: {
				channelId: channel.id,
				userId,
				role: "NONADMIN",
				state: "REGULAR"
			}
		})
	}

	async JoinPrivateChannel(userId: number, body: JoinPrivateChannelDto) {
		const channel = await this.prisma.channel.findFirst({
			where: {
				mode: "PRIVATE",
				password: body.secret
			}
		})

		if (channel) {
			await this.prisma.channelMember.create({
				data: {
					userId,
					state: "REGULAR",
					role: "NONADMIN",
					channelId: channel.id
				}
			})
		}
		else {
			throw new BadRequestException("Wrong channel")
		}
	}

	async leaveChannel(userId: number, channelId: number){
		const member = await this.getChannelMember(userId, channelId)

		if (member.state === "BANNED" || member.state === "MUTED")
			throw new ForbiddenException("You can't leave this channel")

		if (member.role === "OWNER") {
			try {
			await this.prisma.channel.delete({
				where: {
					id: channelId
				}
			})}
			catch (e) {
				throw new InternalServerErrorException('Error while deleting the channel')
			}
		}
		else {
			try {
			await this.prisma.channelMember.delete({
				where: {
					id: member.id
				}
			})}
			catch (e) {
				throw new InternalServerErrorException('Error while leaving the channel')
			}
		}
	}


	async changePrivateChannelSecret(userId: number, channelId: number) {
		const channel = await this.getChannel(channelId)
		const member = await this.getChannelMember(userId, channelId)

		if (member.role === "NONADMIN")
			throw new ForbiddenException('You have not the rights to update this channel')
		if (channel.mode !== "PRIVATE")
			throw new BadRequestException("Wrong Channel")

		const secret = authenticator.generateSecret(60)

		await this.prisma.channel.update({
			where: {
				id: channel.id
			},
			data: {
				password: secret
			}
		})
		return secret
	}

	async getChannelSecret(userId: number, channelId: number) {
		const channel = await this.getChannel(channelId)
		const member = await this.getChannelMember(userId, channelId)

		if (member.role !== "OWNER")
			throw new ForbiddenException('You have not the rights for this channel')
		if (channel.mode !== "PRIVATE")
			throw new BadRequestException("Wrong channel mode")

		return channel.password
	}

	async createNewMessage(userId: number, message: IncomingChannelMessage) {
		const senderMember = await this.getChannelMember(userId, message.channelId)

		if (senderMember.state !== "REGULAR" || this.isMuted(senderMember))
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

				if (await this.userService.doMemberOneBlockedMemberTwo(member.userId, userId))
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

	async uploadBadge(userId: number, channelId: number, file: Express.Multer.File) {
		const ownerId = await this.getChannelOwnerId(channelId)
	
		if (userId !== ownerId)
			throw new ForbiddenException('You can not upload a badge for this channel')
	
		if (!file)
			throw new BadRequestException("No file provided")

		const dimensions = sizeOf(file.buffer)

		if (file.mimetype !== 'image/jpeg' || dimensions.type !== 'jpg')
			throw new BadRequestException("Wrong mime type")
		if (file.size > 100000)
			throw new BadRequestException("File too large")

		if (dimensions.height > 700 || dimensions.height < 50 ||
			dimensions.width > 700 || dimensions.width < 50)
			throw new BadRequestException('Image dimensions are not valid')

		const filename = process.env.BADGE_DIRECTORY + '/' + channelId.toString() + '.jpeg'

		fs.writeFileSync(filename, file.buffer)
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

		if (user.state === "BANNED")
			throw new ForbiddenException('You are banned from this channel')

		if (restrictUser.role === "OWNER")
			throw new ForbiddenException('Cannot restrict the Owner of the channel')

		if (user.role === "ADMIN" && restrictUser.role === "ADMIN")
			throw new ForbiddenException('Admin can not restrict an other admin')

		if (user.role === "NONADMIN")
			throw new ForbiddenException('Only Admin or Owner can restrict a channel member')

		return restrictUser
	}

	async manageRole(userId: number, body: ManageChannelRole) {
		const ownerId = await this.getChannelOwnerId(body.channelId)
	
		if (userId !== ownerId)
			throw new ForbiddenException('You can not manage role for this channel')

		try {
			await this.prisma.channelMember.update({
				where: {
					id: body.memberId,
					NOT: {
						userId: ownerId
					}
				},
				data: {
					role: body.role
				}
			})
		}
		catch(e) {
			throw new NotFoundException('Can not found the member to update')
		}
	}

	async getMembersofChannel(channelId: number) {
		const members = await this.prisma.channelMember.findMany({
			where: {
				channelId
			}
		})

		if (!members || members.length === 0)
			throw new NotFoundException("Channel Not Found")

		return members
	}

	async isUserChannelMember(userId: number, channelId: number): Promise<Boolean> {
		if (!await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		const member = await this.prisma.channelMember.findFirst({
			where: {
				userId,
				channelId
			}
		})

		if (!member || member.state === "BANNED")
			return false
		return true
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
			throw new BadRequestException('You are not a member of this channel')

		return member
	}

	async getChannelMemberNotThrow(userId: number, channelId: number) {
		if (!await this.channelExist(channelId))
			throw new NotFoundException('Channel not found')

		const member = await this.prisma.channelMember.findFirst({
			where: {
				userId,
				channelId
			}
		})

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
			throw new NotFoundException('Channel not found')
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
			throw new NotFoundException('Channel not found')
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
		return member?.userId
	}

	async getChannelOwnerId(channelId: number) {
		const members = await this.getMembersofChannel(channelId)

		for(const member of members) {
			if (member.role === "OWNER")
				return member.userId
		}

		throw new NotFoundException("Owner Not Found")
	}

	async countMemberOfChannels(channelId: number) {
		return await this.prisma.channelMember.count({
			where: {
				channelId,
				NOT: {
					state: "BANNED"
				}
			}
		})
	}

	isMuted(channelMember: ChannelMember) {
		if (!channelMember.muteDate)
			return false
		return channelMember.muteDate.getTime() > new Date().getTime()
	}
	
	async getChannelBadge(res: Response, channelId: number) {
		const imagePath = process.env.BADGE_DIRECTORY + '/' + channelId + '.jpeg'

		if (!fs.existsSync(imagePath)){
			const ownerId: number = await this.getChannelOwnerId(channelId)

			return this.userService.getUserImage(res, ownerId)

		}

		fs.createReadStream(imagePath).pipe(res)
	}


}

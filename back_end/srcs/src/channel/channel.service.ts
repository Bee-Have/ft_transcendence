import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateChannelDto, RespectPasswordPolicy } from './dto/CreateChannel.dto';

@Injectable()
export class ChannelService {

	constructor(
		private prisma: PrismaService,
		private userService: UserService) {}


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
		return messages
	}

	async createChannel(userId: number, body: CreateChannelDto) {
		if (await this.channelNameExist(body.name))
			throw new BadRequestException('Channel name already exist')

		let password: string | null = null

		if (body.mode === "PROTECTED")
		{
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
					password
				}
			})

			try {
				await this.prisma.channelMember.create({
					data: {
						userId,
						role: "OWNER",
						channelId: channel.id
					}
				})
			}
			catch (e) {
				try {
					await this.prisma.channel.delete({
						where: {
							id: channel.id
						}
					})
				} catch (e) {}
				throw e
			}

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

		for (const member of channelMembers)
		{
			if (member.state !== "BANNED")
				channels.push({ 
					name: await this.getChannelName(member.channelId),
					mode: await this.getChannelMode(member.channelId),
					id: member.channelId,
					state: member.state,
					role: member.role
				})
		}

		return channels
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
}

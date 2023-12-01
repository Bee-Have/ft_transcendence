import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { authenticator } from 'otplib'
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { plainToInstance } from "class-transformer";
import { userProfileDto } from "./dto/userProfile.dto";
import { chatProfilDto } from "./dto/chatProfile.dto";
const qrcode =  require('qrcode')
import * as fs from 'fs'
import { Response } from "express";

@Injectable()
export class UserService {

	constructor(private prisma: PrismaService) {}

	/*async getUserInfo(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		return user
	}*/

	async getUserImage(res: Response, username: string)
	{
		const user = await this.getUserInfo(username)

		if (!user)
			throw new NotFoundException("User not found")

		const userId = String(user.id)

		const imagePath = process.env.AVATAR_DIRECTORY + '/' + userId + '.jpeg'

		if (!fs.existsSync(imagePath))
			throw new NotFoundException("Image not found")

		fs.createReadStream(imagePath).pipe(res)
	}

	async getUserInfo(Name: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				username: Name
			}
		})
		return user
	}

	async getUserProfil(username: string) {
		const user = await this.getUserInfo(username)
		//besoin de : achievement
		if (!user)
			throw new NotFoundException("User profile not found")
		
		const trimuser = plainToInstance(userProfileDto, user,{excludeExtraneousValues:true})

		return trimuser
	}

	async getChatProfil(username: string){
		const user = await this.getUserInfo(username)
		//besoin de : achievement
		if (!user)
			throw new NotFoundException("User profile not found")
		const trimuser = plainToInstance(chatProfilDto, user,{excludeExtraneousValues:true})
		return trimuser
	}

	async updateUsername(userId: number, newUsername: string)
	{
		
		await this.prisma.user.updateMany({
			where: {
				id: userId
			},
			data: {
				username: newUsername
			}
		})
		.catch((error) => {
			throw new InternalServerErrorException(error)
		})
	}

	async enableTFA (userId: number) {
		const secret = authenticator.generateSecret(40)

		await this.prisma.user.updateMany({
			where: {
				id: userId
			},
			data: {
				twoFASecret: secret
			}
		})
		return await this.generateQRCode(secret)
	}

	async enableTFACallback(userId:number, code: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		
		const bool = authenticator.verify({ token: code , secret: user.twoFASecret})

		if (!bool)
			throw new UnauthorizedException('Wrong code')
		else
		{
			await this.prisma.user.updateMany({
				where: {
					id: user.id,
				},
				data: {
					isTwoFAEnable: true
				}
			})
		}
	}

	async disableTFA (userId: number) {
		await this.prisma.user.updateMany({
			where: {
				id: userId
			},
			data: {
				isTwoFAEnable: false,
				twoFASecret: null
			}
		})
	}

	async generateQRCode(secret) {
		const otp = authenticator.keyuri(null, 'ft_transcendence', secret)

		try {
			const t = await qrcode.toDataURL(otp)
			return t
		}
		catch (err) {
			console.log(err) 
			throw new InternalServerErrorException('Error wgile generating TFA QRCode');
		}
	}
}
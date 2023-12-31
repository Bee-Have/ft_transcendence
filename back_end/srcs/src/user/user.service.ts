import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import * as fs from 'fs';
import { authenticator } from 'otplib';
import { FriendshipService } from "src/friendship/friendship.service";
import { PrismaService } from "src/prisma/prisma.service";
import { BlockedUser } from "./dto/blocked-user.dto";
import { Friend, FriendRequest } from "./dto/friend.dto";
import { userProfileDto } from "./dto/userProfile.dto";
import { UserInfo, UserStatus } from "./gateway/dto/userStatus.dto";
const qrcode =  require('qrcode')

@Injectable()
export class UserService {

	constructor(private prisma: PrismaService,
				private friendService: FriendshipService) {}

	public connected_user_map = new Map<number, UserInfo>()

	/*async getUserInfo(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		return user
	}*/

	// async getUserImage(res: Response, username: string)
	// {
	// 	const user = await this.getUserInfo(username)

	// 	if (!user)
	// 		throw new NotFoundException("User not found")

	// 	const userId = String(user.id)

	// 	const imagePath = process.env.AVATAR_DIRECTORY + '/' + userId + '.jpeg'

	// 	if (!fs.existsSync(imagePath))
	// 		throw new NotFoundException("Image not found")

	// 	fs.createReadStream(imagePath).pipe(res)
	// }

	// async getUserInfo(Name: string) {
	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			username: Name
	// 		}
	// 	})
	// 	return user
	// }	

	async getUserProfil(userId: number) {
		const user = await this.getUser(userId)
		//besoin de : achievement
		
		const trimuser = plainToInstance(userProfileDto, user, { excludeExtraneousValues:true })

		return trimuser
	}

	async getUserIdByName(username: string) { 
		const user = await this.prisma.user.findUnique({
			where: {
				username
			},
			select: {
				id: true
			}
		})

		if (!user)
			throw new NotFoundException('Username not found')

		return user.id
	}

	async getUsername(userId: number): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				username: true
			}
		})
		
		if (!user)
			throw new NotFoundException('User Not Found')

		return user.username
	}

	getUserImage(res: Response, userId: number)
	{
		const imagePath = process.env.AVATAR_DIRECTORY + '/' + userId + '.jpeg'

		if (!fs.existsSync(imagePath))
			throw new NotFoundException()

		fs.createReadStream(imagePath).pipe(res)
	}

	// async getChatProfil(username: string){
	// 	const user = await this.getUserInfo(username)
	// 	//besoin de : achievement
	// 	if (!user)
	// 		throw new NotFoundException("User profile not found")
	// 	const trimuser = plainToInstance(chatProfilDto, user,{excludeExtraneousValues:true})
	// 	return trimuser
	// }

	async updateUsername(userId: number, newUsername: string)
	{
		console.log(userId, newUsername)
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

	async enableTFA (userId: number): Promise<string> {
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
		const user = await this.getUser(userId)
		
		const bool = authenticator.verify({ token: code , secret: user.twoFASecret})

		if (!bool)
			throw new UnauthorizedException('Wrong code, try again')
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

	async generateQRCode(secret: string): Promise<string> {
		const otp = authenticator.keyuri('', 'ft_transcendence', secret)

		try {
			const t: string = await qrcode.toDataURL(otp)
			return t
		}
		catch (err) {
			console.log(err) 
			throw new InternalServerErrorException('Error while generating TFA QRCode');
		}
	}

	async getUser(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user)
			throw new NotFoundException('User Not Found')

		return user
	}

	async getUserFriendsId(userId: number): Promise<number[]> {
		const friends = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				friends: {
					select: {
						id: true
					}
				},
				friendsRelation: {
					select: {
						id: true
					}
				}
			}
		})

		const friendsWithDuplicate = friends?.friends?.concat(friends.friendsRelation) 

		const unique = new Array<number>()

		friendsWithDuplicate?.forEach((obj) => {
			if (!unique.includes(obj.id) && obj.id != userId)
				unique.push(obj.id)
		})

		return unique 
	}

	async getUserFriends(userId: number) {
		const friendsIds = await this.getUserFriendsId(userId)

		const friends: Friend[] = new Array<Friend>()

		for (const friendId of friendsIds) {
			const friendStatus = this.connected_user_map.get(friendId)?.status

			friends.push({
				id: friendId, 
				username: await this.getUsername(friendId),
				status: friendStatus ? friendStatus : UserStatus.offline
			})
		}

		return friends
	}

	async getOrCreateConversation(memberOneId: number, memberTwoId: number) {

		const [lowestId, greaterId] = memberOneId < memberTwoId ? [memberOneId, memberTwoId] : [memberTwoId, memberOneId];

		const conversation = await this.prisma.conversation.findFirst({
			where: {
				memberOneId: lowestId,
				memberTwoId: greaterId
			}
		})

		if (conversation)
			return conversation

		return await this.prisma.conversation.create({
			data: {
				memberOneId: lowestId,
				memberTwoId: greaterId
			}
		})
	}

	async getUserPendingInvite(userId: number) : Promise<FriendRequest[]> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				receivedFriendRequests: true
			}
		})

		if (!user)
			throw new NotFoundException('User Not found')
		
		const friendsRequest = new Array<FriendRequest>()
		
		for (const friendReq of user.receivedFriendRequests) {
			if (friendReq.status === 'pending') {
			friendsRequest.push({ 
				id: friendReq.senderId,
				username: await this.getUsername(friendReq.senderId)})
			}
		}

		return  friendsRequest
	}

	async doMemberOneBlockedMemberTwo (memberOneId: number, memberTwoId: number) {
		const User = await this.prisma.user.findUnique({
			where: {
				id: memberOneId
			},
			select: {
				blocked: true
			}
		})

		if (!User)
			throw new Error('User not found')

		const blockedUsers = User.blocked

		if (!blockedUsers)
			return false
	
		for (const blockedUser of blockedUsers) {
			if (blockedUser.blockedUserId === memberTwoId)
				return true
		}

		return false
	}

	async isMemberOneBlockedByMemberTwo(memberOneId: number, memberTwoId: number) {
		return this.doMemberOneBlockedMemberTwo(memberTwoId, memberOneId)
	}

	async getBlockedUser(userId: number): Promise<BlockedUser[]> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				blocked: true
			}
		})

		if (!user)
			throw new NotFoundException('User Not found')

		const blockedUser = new Array<BlockedUser>()

		for (const blocked of user.blocked) {
			blockedUser.push({
				id: blocked.blockedUserId,
				username: await this.getUsername(blocked.blockedUserId)
			})
		}

		return blockedUser
	}

}
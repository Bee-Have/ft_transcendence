import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

	constructor(private prisma: PrismaService) {}

	async getUserInfo(userId: number)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		return user
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

}
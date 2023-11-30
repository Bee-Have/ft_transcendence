import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { UserService } from './user.service';
import { PrismaService } from "src/prisma/prisma.service";
import { ImageInterceptor } from "./interceptor/image.interceptor";
import { TfaDto } from "src/auth/dto/tfa.dto";

@Controller('user')
export class UserController {
	
	constructor(private userService: UserService,
				private prisma: PrismaService) {}

	@Get('info')
	SayHello(@GetCurrentUser('sub') userId: number) : Promise<any>
	{
		return this.userService.getUserInfo(userId)
	}

	@Post('update/username')
	updateUsername(@GetCurrentUser('sub') userId: number, @Body() body: any) {
		return this.userService.updateUsername(userId, body.username)
	}

	@Post('upload/avatar')
	@UseInterceptors(ImageInterceptor)
	uploadAvatar() {}

	@Get('tfa/enable')
	async enableTFA(@GetCurrentUser('sub') userId: number) {
		return await this.userService.enableTFA(userId)
	}

	@Get('tfa/enable/callback')
	enableCallbackTFA(	@GetCurrentUser('sub') userId:number,
						@Query() query: TfaDto) {
		console.log(typeof(query.code))
		return this.userService.enableTFACallback(userId, query.code)
	}

	@Get('tfa/disable')
	disableTFA(@GetCurrentUser('sub') userId: number) {
		return this.userService.disableTFA(userId)
	}

}
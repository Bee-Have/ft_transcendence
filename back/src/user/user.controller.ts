import { Body, Controller, Get, Param, Post, Query, Res, UseInterceptors } from "@nestjs/common";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { UserService } from './user.service';
import { PrismaService } from "src/prisma/prisma.service";
import { ImageInterceptor } from "./interceptor/image.interceptor";
import { TfaDto } from "src/auth/dto/tfa.dto";
import { Response } from "express";
import { Public } from "src/common/decorators";
import { ApiBearerAuth, ApiProperty } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller('user')
export class UserController {
	
	constructor(private userService: UserService,
				private prisma: PrismaService) {}

	@Get('profile/:username')
	getProfile(@Param('username') username: string) : Promise<any> {
		return this.userService.getUserProfil(username)
	}

	@Public()
	@Get('image/:username')
	async getImage(@Res() res: Response, @Param('username') username: string) {
		return await this.userService.getUserImage(res, username)
	}
	
	@Get('chat/:username')
	getProfileFromChat(@Param('username') username: string) : Promise<any>
	{
		return this.userService.getChatProfil(username)
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
		return this.userService.enableTFACallback(userId, query.code)
	}

	@Get('tfa/disable')
	disableTFA(@GetCurrentUser('sub') userId: number) {
		return this.userService.disableTFA(userId)
	}

}
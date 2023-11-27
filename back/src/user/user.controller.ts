import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	
	constructor(private userService: UserService) {}

	@Get('info')
	SayHello(@GetCurrentUser('sub') userId: number) : Promise<any>
	{
		return this.userService.getUserInfo(userId)
	}

	@Post('update/username')
	updateUsername(@GetCurrentUser('sub') userId: number, @Body() body: any) {
		this.userService.updateUsername(userId, body.username)
	}
}
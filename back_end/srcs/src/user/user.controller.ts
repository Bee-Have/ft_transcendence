import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Response } from "express";
import { TfaDto } from "src/auth/dto/tfa.dto";
import { Public } from "src/common/decorators";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { updateUsernameDto } from "./dto/updateUsername.dto";
import { ImageInterceptor } from "./interceptor/image.interceptor";
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
	
	constructor(private userService: UserService,
				private prisma: PrismaService) {}

	// @Get('profile/:username')
	// getProfile(@Param('username') username: string) : Promise<any> {
	// 	return this.userService.getUserProfil(username)
	// }

	@Get('idbyname/:username')
	async getuserIdbyName(@Param('username') username: string) {
		return await this.userService.getUserIdByName(username)
	}

	// @Public()
	// @Get('image/:username')
	// async getImage(@Res() res: Response, @Param('username') username: string) {
	// 	return await this.userService.getUserImage(res, username)
	// }
	
	@Get('profile/:id')
	getProfile(@Param('id', ParseIntPipe) userId: number) : Promise<any> {
		return this.userService.getUserProfil(userId)
	}

	@Public()
	@Get('username/:id')
	async getUsername(@Param('id', ParseIntPipe) userId: number): Promise<string> {
		return await this.userService.getUsername(userId)
	}

	@Public()
	@Get('image/:id')
	getImage(@Res() res: Response, @Param('id', ParseIntPipe) userId: number) {
		return this.userService.getUserImage(res, userId)
	}

	// @Get('chat/:username')
	// getProfileFromChat(@Param('username') username: string) : Promise<any>
	// {
	// 	return this.userService.getChatProfil(username)
	// }

	@ApiOperation({ description: 'The route name is clear enough' })
	@ApiConsumes('application/json')
	@ApiBody({schema: {
		type: 'object',
		properties: {
			username: {
				type: 'string',
			}
		}
	}})
	@ApiCreatedResponse({ description: 'The username has been updated'})
	@ApiBadRequestResponse({ description: 'The body is malformed'})
	@Post('update/username')
	updateUsername(@GetCurrentUser('sub') userId: number, @Body() body: updateUsernameDto) {
		return this.userService.updateUsername(userId, body.username)
	}


	@ApiConsumes('multipart/form-data')
	@ApiBody({schema: {
		type: 'object',
		properties: {
			avatar: {
				type: 'file',
				format: 'image/jpeg'
			}
		}
	}})
	@ApiOperation({ description: 'Upload a .jpeg avatar less than 100Kb' })
	@ApiBadRequestResponse({ description: 'The request is malformed' })
	@ApiCreatedResponse({ description: 'The avatar have been uploaded successfully'})
	@Post('upload/avatar')
	@UseInterceptors(ImageInterceptor)
	uploadAvatar() {}


	@ApiOperation({ description: 'A secret is generated on the server, this secret is then returned as a QRCode, the client need to scan it on Google Authenticator and send back the code to the /tfa/enable/callback' })
	@ApiOkResponse({ description: 'A string that represent the QRCode is returned and need to be displayed on the client' })
	@ApiInternalServerErrorResponse({ description: 'An error occured while generating the QRCode, try again' })
	@Get('tfa/enable')
	async enableTFA(@GetCurrentUser('sub') userId: number): Promise<string> {
		return await this.userService.enableTFA(userId)
	}

	@ApiOperation({ description: 'Once the client get is QRCode from the /tfa/enable route, the client need to send the code from Google Authenticator<br>\
	If the client does not send a valid code he can try again as many times as he wants<br>\
	If the client cancels the operation (without providing a valid code), the TFA will NOT be enabled'})
	@ApiOkResponse({ description: 'A valid code has been given and the TFA is now enabled'})
	@ApiUnauthorizedResponse({ description: 'A wrong code has been given, you can try again'})
	@Get('tfa/enable/callback')
	enableCallbackTFA(	@GetCurrentUser('sub') userId:number,
						@Query() query: TfaDto) {
		return this.userService.enableTFACallback(userId, query.code)
	}

	@ApiOperation({ description: 'Disable the TFA'})
	@Get('tfa/disable')
	disableTFA(@GetCurrentUser('sub') userId: number) {
		return this.userService.disableTFA(userId)
	}


	@Public()
	@Get('test')
	async weif(){
		console.log(await this.userService.doMemberOneBlockedMemberTwo(1,2))
		console.log(await this.userService.isMemberOneBlockedByMemberTwo(1,2))
	}

}
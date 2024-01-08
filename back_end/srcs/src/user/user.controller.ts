import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Response } from "express";
import { TfaDto } from "src/auth/dto/tfa.dto";
import { Public } from "src/common/decorators";
import { FriendshipService } from "src/friendship/friendship.service";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { Friend } from "./dto/friend.dto";
import { updateUsernameDto } from "./dto/updateUsername.dto";
import { BlockedUserDto } from "./gateway/dto/blocked-user.dto";
import { ImageInterceptor } from "./interceptor/image.interceptor";
import { UserService } from './user.service';
import { ThrottlerGuard } from "@nestjs/throttler";

@ApiBearerAuth()
@Controller('user')
export class UserController { 
	
	constructor(private userService: UserService,
				private friendService: FriendshipService) {}

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






	@Get('friends')
	async getFriends (@GetCurrentUser('sub') userId: number): Promise<Friend[]>{
		return await this.userService.getUserFriends(userId)
	}


	@Public()
	@Get('test/friend/:id')
	async wehbnfowie(@Param('id', ParseIntPipe) userId: number) {
		return await this.userService.getUserFriends(userId)
	}

	@Public()
	@Get('pending/:id')
	async wjebfiewf(@Param('id', ParseIntPipe) userId: number) {
		return await this.userService.getUserPendingInvite(userId)
	}

//////////////// TODO CHANGE WITH REAL PARAM @GETCURRENTUSER() ////////////////


	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('friend/accept/:id/:rec')
	async wroeufghow(@Param('id', ParseIntPipe) userId: number, @Param('rec', ParseIntPipe) receiverId: number) {
		return await this.friendService.acceptFriendRequest(userId, receiverId)
	}


	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('friend/reject/:id/:rec')
	async woefoef (@Param('id', ParseIntPipe) userId: number, @Param('rec', ParseIntPipe) receiverId: number) {
		return await this.friendService.rejectFriendRequest(userId, receiverId)
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('friend/block/:id')
	async wfgwei(@Param('id', ParseIntPipe) userId: number, @Body() body: BlockedUserDto) {
		return await this.friendService.blockUser(userId, body.blockedUserId)
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('friend/unblock/:id')
	async wfgwewei(@Param('id', ParseIntPipe) userId: number, @Body() body: BlockedUserDto) {
		return await this.friendService.unblockUser(userId, body.blockedUserId)
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Get('blocked/:id')
	async wiefgiwef(@Param('id', ParseIntPipe) userId: number) {
		return await this.userService.getBlockedUser(userId)
	}
//////////////// TODO TEST TO CHANGE WITH REAL PARAM @GETCURRENTUSER() ////////////////


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
	@UseGuards(ThrottlerGuard)
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
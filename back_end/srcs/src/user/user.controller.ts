import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Response } from "express";
import { TfaDto } from "src/auth/dto/tfa.dto";
import { FriendshipService } from "src/friendship/friendship.service";
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { Friend } from "./dto/friend.dto";
import { updateUserDescriptionDto, updateNicknameDto } from "./dto/updateNickname.dto";
import { UserService } from './user.service';
import { UserStatusEventDto } from "./gateway/dto/userStatus.dto";
import { Public } from "src/common/decorators";

@ApiBearerAuth()
@Controller('user')
export class UserController { 
	
	constructor(private userService: UserService,
				private friendService: FriendshipService) {}

	@Get('idbyname/:username')
	async getuserIdbyName(@Param('username') username: string) {
		return await this.userService.getUserIdByName(username)
	}
	
	@Get('profile/edit')
	async getEditProfile(@GetCurrentUser('sub') userId: number) : Promise<any> {
		return this.userService.getUserEditProfil(userId)
	}

	@Get('profile/:id')
	getProfile(@Param('id', ParseIntPipe) userId: number) : Promise<any> {
		return this.userService.getUserProfil(userId)
	}

	@Get('friends')
	async getFriends (@GetCurrentUser('sub') userId: number): Promise<Friend[]>{
		return await this.userService.getUserFriends(userId)
	}

	@Get('pending')
	async wjebfiewf(@GetCurrentUser('sub') userId: number) {
		return await this.userService.getUserPendingInvite(userId)
	}

	@Get('friend/create/:receiverId')
	async CreateFriendRequest(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		return await this.friendService.createFriendRequest(userId, receiverId)
	}

	@Get('friend/cancel/:receiverId')
	async CancelFriendRequest(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		return await this.friendService.cancelFriendRequest(userId, receiverId)
	}
		
	@HttpCode(HttpStatus.OK)
	@Post('friend/accept/:receiverId')
	async AcceptFriendRequest(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		await this.friendService.acceptFriendRequest(userId, receiverId)
	
		const newFriend = this.userService.connected_user_map.get(receiverId)

		if (newFriend)
		{
			const user = this.userService.connected_user_map.get(userId)
			newFriend.socket.join(receiverId.toString())
			user?.socket.join(receiverId.toString())

			if (user)
				newFriend.socket.emit('user-status', new UserStatusEventDto(user))
			user?.socket.emit('user-status', new UserStatusEventDto(newFriend))
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('friend/reject/:receiverId')
	async RejectFriendRequest (
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		return await this.friendService.rejectFriendRequest(userId, receiverId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('friend/block/:receiverId')
	async BlockUser(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		return await this.friendService.blockUser(userId, receiverId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('friend/unblock/:receiverId')
	async UnblockUser(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		return await this.friendService.unblockUser(userId, receiverId)
	}

	@HttpCode(HttpStatus.OK)
	@Post('friend/delete/:receiverId')
	async DeleteFriend(
		@GetCurrentUser('sub') userId: number,
		@Param('receiverId', ParseIntPipe) receiverId: number
	) {
		await this.friendService.deleteFriend(userId, receiverId)
	}

	@Get('blocked')
	async GetBlockedUser(@GetCurrentUser('sub') userId: number,) {
		return await this.userService.getBlockedUser(userId)
	}

	@Get('username')
	async GetUsername(@GetCurrentUser('sub') userId: number): Promise<string> {
		return await this.userService.getUsername(userId)
	}

	@Public()
	@Get('image/:userId')
	getImage(
		@Res() res: Response,
		@Param('userId', ParseIntPipe) userId: number
	) {
		return this.userService.getUserImage(res, userId)
	}

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
	@Post('update/nickname')
	async UpdateNickName(@GetCurrentUser('sub') userId: number,
	@Body() body: updateNicknameDto) {
		return await this.userService.updateNickName(userId, body.nickname)
	}

	@Post('update/description')
	async UpdateDescription(@GetCurrentUser('sub') userId: number,
		@Body() description: updateUserDescriptionDto) {
		await this.userService.updateDescription(userId, description.description)
	}

	@Public()
	@Get('leaderboard')
	async getLeaderboard() {
		return await this.userService.fctLeaderboard()
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
	@UseInterceptors(FileInterceptor('avatar'))
	uploadAvatar(@UploadedFile() file: Express.Multer.File,
				@GetCurrentUser('sub') userId: number) {
		this.userService.uploadAvatar(userId, file)
	}

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
	async disableTFA(@GetCurrentUser('sub') userId: number) {
		return await this.userService.disableTFA(userId)
	}
}
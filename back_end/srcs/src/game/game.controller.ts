import { Controller, Get, Post, Param, HttpCode, HttpStatus, Body, Delete } from '@nestjs/common';
import { Public } from "src/common/decorators";

import { GameService } from './game.service';

import { DeclineInviteDto, GameMatchmakingDto, SendInviteDto, InviteDto } from './dto/game-invite.dto';

@Public()
@Controller('game')
export class GameController {
	constructor(private gameService: GameService)
	{}

	@Post('matchmaking/:userId')
	async joinMatchmaking(
		@Param('userId') userId: number,
		@Body() MatchmakingMode: {gameMode: string}
	): Promise<number> {
		console.log('join matchmaking: ', userId, MatchmakingMode, MatchmakingMode.gameMode)
		return await this.gameService.joinMatchmaking(userId, MatchmakingMode.gameMode);
	}

	@Get('matchmaking/leave/:userId')
	async leaveMatchmaking(@Param('userId') userId: number) {
		console.log('leave matchmaking: ', userId)
		return await this.gameService.leaveMatchmaking(userId);
	}

	@Get('invites/:userId')
	async getUserInvites(@Param('userId') userId: number): Promise<InviteDto[]> {
		console.log('get user invites: ', userId)
		return await this.gameService.getUserInvites(userId);
	}

	@Post('deleteInvites/:userId')
	async deleteUserInvites(@Param('userId') userId: number) {
		console.log('delete invites: ', userId)
		return await this.gameService.deleteUserInvites(userId);
	}

	@Post('sendInvite/:userId')
	async sendInvite(
		@Param('userId') userId: number,
		@Body() invitedUserDto: SendInviteDto
	) {
		console.log('send invite: ', invitedUserDto.invitedUserId, invitedUserDto.gameMode)
		return await this.gameService.sendInvite(userId, invitedUserDto);
	}

	@Post('declineInvite/:userId')
	async declineInvite(
		@Param('userId') userId: number,
		@Body() declineInviteDto: DeclineInviteDto
	) {
		console.log('decline invite: ', declineInviteDto.declinedUserId)
		return await this.gameService.declineInvite(userId, declineInviteDto.declinedUserId);
	}
}
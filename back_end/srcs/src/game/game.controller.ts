import { Controller, Get, Post, Param, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { Public } from "src/common/decorators";

import { GameService } from './game.service';

import { GameMatchmakingDto } from './dto/game-invite.dto';

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
	async getUserInvites(@Param('userId') userId: number) {
		console.log('get user invites: ', userId)
		return await this.gameService.getUserInvites(userId);
	}
}
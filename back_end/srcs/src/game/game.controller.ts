import { Controller, Get } from '@nestjs/common';
import { Public } from "src/common/decorators";

import { GameService } from './game.service';

@Public()
@Controller('game')
export class GameController {
	constructor(private gameService: GameService)
	{}

	@Get('matchmaking')
	async handleMatchmaking() {
		console.log('matchmaking')
	}
}
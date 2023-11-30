import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens } from 'src/auth/types';
import { RtGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { TfaGuard } from 'src/common/guards/tfa.guard';
import { TfaDto } from './dto/tfa.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

	@Public()
	@Get()
	redirect(@Res() res: Response): string {
    	const url = this.authService.getFtAuthenticationUri();
		return url;
	}

	@Public()
	@Get('callback')
	async authentication(@Query() query: AuthDto, @Res() res: Response): Promise<void> {
		await this.authService.authenticateUser(query, res);
	}

	@Public()
	@UseGuards(TfaGuard)
	@Post("tfa")
	async tfa(@Body() body: TfaDto, @GetCurrentUser('sub') userId: number) {
		console.log(body)
		return this.authService.verifyTfa(body.code, userId) 
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser('sub') userId: number) {
		return this.authService.logout(userId);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('refresh')
	// @Api
	@HttpCode(HttpStatus.OK)
  	refreshTokens(	@GetCurrentUser('sub') userId: number, 
  					@GetCurrentUser('refreshToken') rt: string) {
		return this.authService.refreshTokens(userId, rt);
	}
}


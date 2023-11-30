import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens, TokensDto } from 'src/auth/types/tokens.type';
import { RtGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { TfaGuard } from 'src/common/guards/tfa.guard';
import { TfaDto } from './dto/tfa.dto';
import { ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FtApiUserDto } from './dto/ftapi.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

	@ApiResponse({
		status: 200, 
		description: 'Return url that client needs to be redirected to, to get 42 loging page'})
	@Public()
	@Get()
	redirect(): string {
    	const url = this.authService.getFtAuthenticationUri();
		return url;
	}

	@Public()
	@ApiExcludeEndpoint()
	@Get('callback')
	async authentication(@Query() query: AuthDto, @Res() res: Response): Promise<void> {
		await this.authService.authenticateUser(query, res);
	}

	@ApiUnauthorizedResponse({
		description: 'Wrong code'
	})
	@ApiOkResponse({
		description : 'User is logged in and tokens are returned',
		type: TokensDto
	})
	@Public()
	@UseGuards(TfaGuard)
	@Get("tfa")
	async tfa(@Query() query: TfaDto, @GetCurrentUser('sub') userId: number) {
		return this.authService.verifyTfa(query.code, userId) 
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


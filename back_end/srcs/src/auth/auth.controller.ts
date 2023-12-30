import { Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens, TokensDto } from 'src/auth/types/tokens.type';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { TfaGuard } from 'src/common/guards/tfa.guard';
import { AuthService } from './auth.service';
import { TfaDto } from './dto/tfa.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

	@ApiOperation({ description: 'Return the url that the client need to be redirected to, to get 42 loging page'})
	@ApiOkResponse({ description: 'The url is returned' })
	@Public()
	@Get()
	redirect(): string {
		return this.authService.getFtAuthenticationUri();
	}


	@ApiOperation({ description: 'Once the client is redirected to the URL given by /auth, this route will be called automatically, it will then set the cookies with credentials info and redirect the client to the frontend URL<br>\
	The user TFA is enabled, two cookies are set: 1) TfaEnable: true, 2) TfaToken: string. Then you need to call the /auth/tfa route with the HTTP header Authorization set to {Bearer {TfaToken}}<br>\
	The user TFA is disabled, three cookies are set: 1) TfaEnable: false, 2) access_token: string, 3) refresh_token: string'})
	@Public()
	@Get('callback')
	async authentication(@Query() query: AuthDto, @Res() res: Response): Promise<void> {
		await this.authService.authenticateUser(query, res);
	}


	@ApiOperation({ description: 'When the TfaEnable cookie is set to true this route needs to be called with the http Authorization header set to {Bearer {the value of the TfaToken}} in order to get access and refresh tokens'})
	@ApiUnauthorizedResponse({
		description: 'Wrong code, try again'
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

	@ApiOperation({ description: 'Call this route if for any reason you no longer want your refresh token to be usable' })
	@ApiOkResponse({ description: 'The refresh token is no longer usable' })
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser('sub') userId: number) {
		return this.authService.logout(userId);
	}

	@ApiOperation({ description: 'Provide the refresh token to get new access and refresh tokens'})
	@ApiOkResponse({ description: 'New tokens are returned', type: TokensDto })
	@ApiNotFoundResponse({ description: 'The user was not found' })
	@ApiForbiddenResponse({ description: 'The refresh token provided is not usable (the user loged out || the refresh token is not the last one provided)' })
	@Public()
	@UseGuards(RtGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
  	async refreshTokens(	@GetCurrentUser('sub') userId: number, 
  					@GetCurrentUser('refreshToken') rt: string,
					@Res() res: Response): Promise<void> {
		const tokens = await this.authService.refreshTokens(userId, rt);

		res.cookie('access_token', tokens.access_token, { httpOnly: false, sameSite: 'strict', maxAge: 7*24*60*60*100})
		res.cookie('refresh_token', tokens.refresh_token, { httpOnly: false, sameSite: 'strict', maxAge: 7*24*60*60*100})
		res.cookie('userId', userId, { httpOnly: false, sameSite: 'strict', maxAge: 7*24*60*60*100 });

		res.send()
	}
}


import { Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens } from 'src/auth/types';
import { RtGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get()
  redirect(@Res() res: Response): any {
    const url = this.authService.getFtAuthenticationUri();
		return res.redirect(url);
	}

  @Public()
  @Get('callback')
  authentication(@Query() query: AuthDto): Promise<Tokens> {
	return this.authService.authenticateUser(query);
  }


  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: number) {
	return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUser('sub') userId: number, 
  				@GetCurrentUser('refreshToken') rt: string) {
	return this.authService.refreshTokens(userId, rt);
  }
}


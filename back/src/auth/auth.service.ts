import { Injectable, BadRequestException, HttpException, ForbiddenException, ConsoleLogger, HttpStatus } from '@nestjs/common';
import { URLSearchParams } from 'url';
import axios from 'axios';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { FtApiUserDto } from 'src/auth/dto/ftapi.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from 'src/auth/types';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2'

@Injectable()
export class AuthService {

	constructor(private prisma: PrismaService, 
		private jwtService: JwtService) {}

	getFtAuthenticationUri(): string {
		const uri = this.buildFtAuthUri()

		return uri
	}

	async authenticateUser(query: AuthDto): Promise<Tokens> {
		const userFtToken: string = await this.getFtApiToken(query.code, query.state)

		const userData: FtApiUserDto = await this.getUserDataFromFtApi(userFtToken)

		const user = await this.prisma.user.findUnique({
			where: {
				id: userData.id
			}
		})

		if (!user)
		{
			await this.prisma.user.create({
				data: {
					id: userData.id,
					email: userData.email,
					username: userData.login
				},
			})
		}

		const tokens = await this.getTokens(userData.id, userData.email)

		await this.updateRtHash(userData.id, tokens.refresh_token)

		return tokens
	}

	async logout(userId: number) {
		await this.prisma.user.updateMany({
			where: {
			  id: userId,
			  hashedRt: {
				  not: null
			  }
      		},
			data: {
				hashedRt: null
			}
		})
	}

	async refreshTokens(userId: number, rt: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user)
			throw new ForbiddenException('No user match')
	
		if (!user.hashedRt || !(await verify(user.hashedRt, rt)))
			throw new ForbiddenException('Invalid refresh token')

		const tokens = await this.getTokens(user.id, user.email)
	
		await this.updateRtHash(user.id, tokens.refresh_token)

		return tokens
	}

	async getFtApiToken(code: string, state: string): Promise<any> {

		if (state != process.env.FT_API_AUTH_STATE)
			throw new BadRequestException('Are you trying to hack something ? I see you 👀');

		const authCallbackUri = process.env.BACKEND_URL + process.env.AUTH_CALLBACK_URI;

		const user = await axios.postForm(process.env.FT_OAUTH_TOKEN_URL, {
			grant_type: 'authorization_code',
			client_id: process.env.FT_API_CLIENTID,
			client_secret: process.env.FT_API_SECRET,
			code: code,
			redirect_uri: authCallbackUri,
			state: process.env.FT_API_AUTH_STATE,
		})
		.catch((err) => {
			const res = {
				message: '42 Auth API returned an error for token request', 
				...err.response.data}

			throw new HttpException(res, err.response.status)
		})
		return user.data.access_token;
	}

	async getUserDataFromFtApi(access_token: string): Promise<FtApiUserDto> {

		const res = await axios.get('https://api.intra.42.fr/v2/me', {
		headers: {
				'Authorization': `Bearer ${access_token}`
			}
		})
		.catch((error) => {
			if (error.response)
			{
				const res = {
					message: '42 api returned an error while getting user info',
					...error.response.data, }

				throw new HttpException(res, error.response.status)
			}
			throw new HttpException('Something went wrong when requesting user infos at 42 API', HttpStatus.BAD_REQUEST)
		})

		const user_data = plainToInstance(FtApiUserDto, res.data, {excludeExtraneousValues:true})

		return user_data
	}

	async getTokens(userId: number , email: string): Promise<Tokens> {

		const userData = {
			sub: userId,
			email: email
		}

		const [at, rt] = await Promise.all([
		this.jwtService.signAsync(userData, {
			secret: process.env.JWT_AT_SECRET,
			expiresIn: 60 * 60
		})
		.catch((error) => {
			console.log(error)
			throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
		}),
		this.jwtService.signAsync(userData, {
		 	secret: process.env.JWT_RT_SECRET,
			expiresIn: 60 * 60 * 7 * 24
		})
		.catch((error) => {
			console.log(error)
			throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
		})
		])

		return {
			access_token: at,
			refresh_token: rt
		}
	}

	async updateRtHash(userId: number, rt: string) {
		const hashed = await this.hashData(rt)

		await this.prisma.user.updateMany({
			where: {
				id: userId
			},
			data: {
				hashedRt: hashed
			}
		})
	}

	async hashData(data: string) {
		return await hash(data)
	}

	buildFtAuthUri():string {
		const authCallbackUri = process.env.BACKEND_URL + process.env.AUTH_CALLBACK_URI
		const paramString = new URLSearchParams('')
	
		paramString.append('client_id', process.env.FT_API_CLIENTID)
		paramString.append('redirect_uri', authCallbackUri)
		paramString.append('response_type', 'code');
		paramString.append('scope', 'public');
		paramString.append('state', process.env.FT_API_AUTH_STATE);
	
		const url = process.env.FT_OAUTH_AUTHO_URL + '?' + paramString.toString();
		
		return url
	}
}
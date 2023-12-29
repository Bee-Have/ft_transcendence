import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express'

const cookieExtractor = (req) => {

	if (req.cookies)
		return req.cookies['refresh_token']
	
	return null
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh')
{
	constructor(){
		super({
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_RT_SECRET,
			passReqToCallback: true
		})
	}

	validate(req: Request, payload: any) {
		const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
		
		return {
			...payload,
			refreshToken
		}
	}
}
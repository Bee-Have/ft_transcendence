import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

const cookieExtractor = (req) => {

	if (req.cookies)
		return req.cookies['access_token']

	return null
}


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt')
{
	constructor(){
		super({
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_AT_SECRET
		})
	}

	validate(payload: any) {
		return payload;
	}
}
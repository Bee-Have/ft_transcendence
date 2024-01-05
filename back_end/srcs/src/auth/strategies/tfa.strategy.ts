import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


const cookieExtractor = (req) => {

	if (req.cookies)
		return req.cookies['TfaToken']

	return null
}

@Injectable()
export class TfaStrategy extends PassportStrategy(Strategy, 'tfa')
{
	constructor(){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_TFA_SECRET
		})
	}

	validate(payload: any) {
		return payload;
	}
}
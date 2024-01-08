import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AtGuard extends AuthGuard('jwt')
{
	constructor(private reflector: Reflector) {
		super()
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride('isPublic', [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic)
			return true

		return super.canActivate(context)
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
		if (err || !user)
		{
			throw err || new UnauthorizedException('Invalid token: ' + info.message)
		}
		return user
	}
}
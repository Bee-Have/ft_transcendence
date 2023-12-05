import { AuthGuard } from "@nestjs/passport";

export class TfaGuard extends AuthGuard('tfa')
{
	constructor() {
		super()
	}
}
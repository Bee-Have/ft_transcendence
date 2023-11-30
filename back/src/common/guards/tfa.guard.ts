import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export class TfaGuard extends AuthGuard('tfa')
{
	constructor() {
		super()
	}
}
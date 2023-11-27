import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens } from 'src/auth/types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    redirect(res: Response): any;
    authentication(query: AuthDto): Promise<Tokens>;
    logout(userId: number): Promise<void>;
    refreshTokens(userId: number, rt: string): Promise<Tokens>;
}

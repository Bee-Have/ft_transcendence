import { AuthDto } from 'src/auth/dto/auth.dto';
import { FtApiUserDto } from 'src/auth/dto/ftapi.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from 'src/auth/types';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getFtAuthenticationUri(): string;
    authenticateUser(query: AuthDto): Promise<Tokens>;
    logout(userId: number): Promise<void>;
    refreshTokens(userId: number, rt: string): Promise<Tokens>;
    getFtApiToken(code: string, state: string): Promise<any>;
    getUserDataFromFtApi(access_token: string): Promise<FtApiUserDto>;
    getTokens(userId: number, email: string): Promise<Tokens>;
    updateRtHash(userId: number, rt: string): Promise<void>;
    hashData(data: string): Promise<string>;
    buildFtAuthUri(): string;
}

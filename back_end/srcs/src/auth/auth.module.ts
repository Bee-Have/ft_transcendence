import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtStrategy, RtStrategy } from './strategies';
import { TfaStrategy } from './strategies/tfa.strategy';

@Module({  
	imports: [JwtModule.register({}), PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService, AtStrategy, RtStrategy, TfaStrategy, PrismaService],
	exports: [JwtService, AuthService]
})
export class AuthModule {}

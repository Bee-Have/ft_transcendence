import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtStrategy, RtStrategy } from './strategies';
import { TfaStrategy } from './strategies/tfa.strategy';
import { ScheduleModule } from '@nestjs/schedule';

@Module({  
	imports: [JwtModule.register({}), PrismaModule, ScheduleModule.forRoot()],
	controllers: [AuthController],
	providers: [AuthService, JwtService, AtStrategy, RtStrategy, TfaStrategy],
	exports: [JwtService, AuthService]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtStrategy, RtStrategy } from './strategies';

@Module({  
	imports: [JwtModule.register({}), PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService, AtStrategy, RtStrategy, PrismaService],
	exports: [JwtService, AuthService]
})
export class AuthModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserGateway } from './user/gateway/user.gateway';
import { FriendshipService } from './friendship/friendship.service';

@Module({
  imports: [ConfigModule.forRoot({expandVariables: true}), HttpModule, AuthModule, PrismaModule, UserModule],
  controllers: [AppController, AuthController, UserController],
  providers:	[AppService, AuthService,
				{
					provide: APP_GUARD, 
					useClass:AtGuard
				}]
})
export class AppModule {}

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
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrivateMessageController } from './privatemessage/privatemessage.controller';
import { PrivateMessageService } from './privatemessage/privatemessage.service';
import { PrivateMessageModule } from './privatemessage/privatemessage.module';

@Module({
  imports: [ConfigModule.forRoot({expandVariables: true}), HttpModule, AuthModule, PrismaModule, UserModule, PrivateMessageModule],
  controllers: [AppController],
  providers:	[AppService,
				{
					provide: APP_GUARD, 
					useClass:AtGuard
				},]
})
export class AppModule {}

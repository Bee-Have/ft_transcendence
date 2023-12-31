import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { PrivateMessageModule } from './privatemessage/privatemessage.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({ expandVariables: true }),
		HttpModule,
		AuthModule,
		PrismaModule, 
		UserModule,
		PrivateMessageModule,
		ThrottlerModule.forRoot([{ttl: 30000, limit: 3}])
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AtGuard
		},
	],
})
export class AppModule { }

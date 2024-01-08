import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PrivateMessageController } from './privatemessage.controller';
import { PrivateMessageService } from './privatemessage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendshipService } from 'src/friendship/friendship.service';

@Module({
	imports: [UserModule, PrismaModule],
	controllers: [PrivateMessageController],
	providers: [PrivateMessageService, FriendshipService],
	exports: [PrivateMessageService]
})
export class PrivateMessageModule {}

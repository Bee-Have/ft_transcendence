import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService]

})
export class ChannelModule {}

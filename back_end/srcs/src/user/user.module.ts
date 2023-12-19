import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { FriendshipService } from 'src/friendship/friendship.service';
import { PrismaModule } from "src/prisma/prisma.module";
import { UserGateway } from "src/user/gateway/user.gateway";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
	imports: [PrismaModule, JwtModule, AuthModule], 
controllers: [UserController],
	providers: [UserService, JwtService, FriendshipService, UserGateway],
	exports: [UserService]
})
export class UserModule {}
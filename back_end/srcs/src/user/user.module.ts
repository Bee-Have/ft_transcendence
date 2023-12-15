import { Module, OnModuleInit } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserGateway } from "src/user/gateway/user.gateway";
import { FriendshipService } from 'src/friendship/friendship.service';


@Module({
	imports: [PrismaModule, JwtModule, AuthModule], 
controllers: [UserController],
	providers: [UserService, JwtService, FriendshipService, UserGateway],
	exports: [UserService]
})
export class UserModule {}
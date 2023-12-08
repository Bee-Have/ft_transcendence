import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";


@Module({
	imports: [PrismaModule, PrismaModule, JwtModule],
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtService, AuthService],
	exports: []
})
export class UserModule {}
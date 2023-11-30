import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";


@Module({
	imports: [PrismaModule, AuthModule, PrismaModule],
	controllers: [UserController],
	providers: [AuthService, UserService, PrismaService],
	exports: []
})
export class UserModule {}
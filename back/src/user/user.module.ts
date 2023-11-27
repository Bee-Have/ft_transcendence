import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [UserController],
	providers: [AuthService, UserService],
	exports: []
})
export class UserModule {}
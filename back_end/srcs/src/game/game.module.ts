import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./gateway/game.gateway";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}

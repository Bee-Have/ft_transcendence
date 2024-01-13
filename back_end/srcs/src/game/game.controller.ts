import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Body,
  Delete,
} from "@nestjs/common";
import { Public } from "src/common/decorators";

import { GameService } from "./game.service";

import {
  GameMatchmakingDto,
  SendInviteDto,
  DeclineInviteDto,
  AcceptInviteDto,
  InviteDto,
} from "./dto/game-invite.dto";

@Public()
@Controller("game")
export class GameController {
  constructor(private gameService: GameService) {}

  @Post("matchmaking/:userId")
  async joinMatchmaking(
    @Param("userId") userId: number,
    @Body() joinMatchmakingDto: GameMatchmakingDto
  ): Promise<number> {
    return await this.gameService.joinMatchmaking(
      userId,
      joinMatchmakingDto.gameMode
    );
  }

  @Get("matchmaking/leave/:userId")
  async leaveMatchmaking(@Param("userId") userId: number) {
    return await this.gameService.leaveMatchmaking(userId);
  }

  @Get("invites/:userId")
  async getUserInvites(@Param("userId") userId: number): Promise<InviteDto[]> {
    return await this.gameService.getUserInvites(userId);
  }

  @Post("deleteInvites/:userId")
  async deleteUserInvites(@Param("userId") userId: number) {
    return await this.gameService.deleteUserInvites(userId);
  }

  @Post("sendInvite/:userId")
  async sendInvite(
    @Param("userId") userId: number,
    @Body() invitedUserDto: SendInviteDto
  ) {
    return await this.gameService.sendInvite(userId, invitedUserDto);
  }

  @Post("declineInvite/:userId")
  async declineInvite(
    @Param("userId") userId: number,
    @Body() declineInviteDto: DeclineInviteDto
  ) {
    return await this.gameService.declineInvite(
      userId,
      declineInviteDto.declinedUserId
    );
  }

  @Post("acceptInvite/:userId")
  async acceptInvite(
    @Param("userId") userId: number,
    @Body() acceptInviteDto: AcceptInviteDto
  ) {
    return await this.gameService.acceptInvite(
      userId,
      acceptInviteDto.acceptedUserId
    );
  }
}

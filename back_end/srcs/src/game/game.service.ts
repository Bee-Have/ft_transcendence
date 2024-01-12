import { Injectable } from "@nestjs/common";
import { equal } from "assert";
import { PrismaService } from "src/prisma/prisma.service";
import { UserInfo, UserStatus } from "src/user/gateway/dto/userStatus.dto";
import { UserService } from "src/user/user.service";

import { GameMatchmakingDto, SendInviteDto } from "./dto/game-invite.dto";

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async joinMatchmaking(userId: number, gameMode: string) {
    // Get invitation without receiver and the same game mode
    const gameInvites = await this.prisma.gameInvite.findMany({
      where: {
        receiver: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (gameInvites.length > 0) {
      gameInvites.forEach((gameInvite) => {
        if (gameInvite.senderId === userId) {
          return userId;
        }
      });

      // Matchmaking logic here.
      //   const opponent: UserInfo = this.userService.connected_user_map.get(gameInvites[0].senderId);
      //   opponent.socket.emit('game-found', userId);
      console.log("matchmaking with other: ", gameInvites[0].senderId);
      return gameInvites[0].senderId;
    }

    console.log("matchmaking: ", userId);

    const newGameInvite = await this.prisma.gameInvite.create({
      data: {
        senderId: userId,
        gameMode: gameMode,
      },
    });

    const player: UserInfo = this.userService.connected_user_map.get(userId);

    if (player) {
      player.socket.emit("new-invite");
    }
    return userId;
  }

  async leaveMatchmaking(userId: number) {
    const gameInvite = await this.prisma.gameInvite.findFirst({
      where: {
        senderId: userId,
        receiver: null,
      },
    });

    if (gameInvite) {
      await this.prisma.gameInvite.delete({
        where: {
          id: gameInvite.id,
        },
      });

      const player: UserInfo = this.userService.connected_user_map.get(userId);

      if (player) {
        player.socket.emit("new-invite");
      }
    }
    return { userId };
  }

  async getUserInvites(userId: number) {
    const gameInvites = await this.prisma.gameInvite.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log("gameInvites: ", gameInvites);
    return gameInvites;
  }

  async deleteUserInvites(userId: number) {
    await this.prisma.gameInvite.deleteMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });

    const player: UserInfo = this.userService.connected_user_map.get(userId);

    if (player) {
      player.socket.emit("new-invite");
    }

    return { userId };
  }

  async sendInvite(userId: number, invitedUserDto: SendInviteDto) {
    const invitedUser = this.userService.connected_user_map.get(
      invitedUserDto.invitedUserId
    );
    const invitee: UserInfo = this.userService.connected_user_map.get(userId);

    if (
      invitedUser === undefined ||
      invitedUser.userstatus === UserStatus.ingame ||
      invitedUser.userstatus === UserStatus.ingamesolo ||
      invitedUser.userstatus === UserStatus.offline ||
      invitee === undefined ||
      invitee.userstatus === UserStatus.ingame ||
      invitee.userstatus === UserStatus.ingamesolo ||
      invitee.userstatus === UserStatus.offline
    )
      return { msg: "User is not available" };

    const gameInvite = await this.prisma.gameInvite.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: invitedUserDto.invitedUserId,
          },
          {
            senderId: invitedUserDto.invitedUserId,
            receiverId: userId,
          },
        ],
      },
    });

    if (gameInvite.length > 0) return { msg: "Invite already sent" };

    const newGameInvite = await this.prisma.gameInvite.create({
      data: {
        senderId: userId,
        receiverId: invitedUserDto.invitedUserId,
        gameMode: invitedUserDto.gameMode,
      },
    });

    invitedUser.socket.emit("new-invite");
    invitee.socket.emit("new-invite");

    return { msg: "Invite sent" };
  }
}

import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { equal } from "assert";
import { PrismaService } from "src/prisma/prisma.service";
import { UserInfo, UserStatus } from "src/user/gateway/dto/userStatus.dto";
import { UserService } from "src/user/user.service";

import {
  GameMatchmakingDto,
  SendInviteDto,
  AcceptInviteDto,
  InviteDto,
} from "./dto/game-invite.dto";

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async joinMatchmaking(userId: number, gameMode: string) {
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

  async getUserInvites(userId: number): Promise<InviteDto[]> {
    let result: InviteDto[] = [];

    const gameInvite = await this.prisma.gameInvite.findMany({
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
      select: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
        gameMode: true,
      },
    });

    if (gameInvite === undefined || gameInvite.length == 0) return result;

    gameInvite.forEach((invite) => {
      result.push({
        sender: {
          id: invite.sender.id,
          username: invite.sender.username,
          userstatus: this.userService.connected_user_map.get(invite.sender.id)
            ?.userstatus,
          photo: process.env.BACKEND_URL + "/user/image/" + invite.sender.id,
        },
        gameMode: invite.gameMode,
      });
      result[result.length - 1].receiver = invite.receiver
        ? {
            id: invite.receiver.id,
            username: invite.receiver.username,
            userstatus: this.userService.connected_user_map.get(
              invite.receiver.id
            )?.userstatus,
            photo:
              process.env.BACKEND_URL + "/user/image/" + invite.receiver.id,
          }
        : undefined;
    });

    return result;
  }

  async deleteUserInvites(userId: number) {
    let opponentsId: number[] = [];
    const userGameInvites = await this.prisma.gameInvite.findMany({
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
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    userGameInvites.forEach((gameInvite) => {
      if (gameInvite.senderId !== userId) {
        opponentsId.push(gameInvite.senderId);
      }
      if (gameInvite.receiverId !== userId && gameInvite.receiverId !== null) {
        opponentsId.push(gameInvite.receiverId);
      }
    });

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

    opponentsId.forEach((opponentId) => {
      const opponent: UserInfo =
        this.userService.connected_user_map.get(opponentId);

      opponent?.socket.emit("new-invite");
    });

    const player: UserInfo = this.userService.connected_user_map.get(userId);
    player?.socket.emit("new-invite");

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
      throw new HttpException("Users are not both available", 417);

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

    if (gameInvite.length > 0) {
      throw new HttpException("Invite already exist", 409);
    }

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

  async declineInvite(userId: number, declinedUserId: number) {
    await this.prisma.gameInvite.deleteMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: declinedUserId,
          },
          {
            senderId: declinedUserId,
            receiverId: userId,
          },
        ],
      },
    });

    const declined: UserInfo =
      this.userService.connected_user_map.get(declinedUserId);
    const declinee: UserInfo = this.userService.connected_user_map.get(userId);

    if (declined) {
      declined.socket.emit("new-invite");
    }
    if (declinee) {
      declinee.socket.emit("new-invite");
    }
  }
}

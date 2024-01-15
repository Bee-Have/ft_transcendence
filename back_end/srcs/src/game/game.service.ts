import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { equal } from "assert";
import { PrismaService } from "src/prisma/prisma.service";
import { UserInfo, UserStatus } from "src/user/gateway/dto/userStatus.dto";
import { UserService } from "src/user/user.service";

import {
  GameMatchmakingDto,
  SendInviteDto,
  InviteDto,
} from "./dto/game-invite.dto";

import { GameInfo, MatchHistoryItemDto } from "./gateway/game-info.dto";

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async joinMatchmaking(userId: number, gameMode: string) {
    const gameInvites = await this.prisma.gameInvite.findMany({
      where: {
        OR: [
          { receiver: null, gameMode: gameMode },
          { receiver: null, senderId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (gameInvites.length > 0) {
      gameInvites.forEach((gameInvite) => {
        if (gameInvite.senderId === userId) {
          throw new HttpException("Already in matchmaking", 409);
        }
      });

      await this.prisma.gameInvite.update({
        where: {
          id: gameInvites[0].id,
        },
        data: {
          receiverId: userId,
          acceptedInvite: true,
        },
      });

      const opponent: UserInfo = this.userService.connected_user_map.get(
        gameInvites[0].senderId
      );
      opponent.socket.emit("new-invite");
      const player: UserInfo = this.userService.connected_user_map.get(userId);
      player.socket.emit("new-invite");
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
        acceptedInvite: true,
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
        acceptedInvite: invite.acceptedInvite,
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

  async acceptInvite(userId: number, acceptedUserId: number) {
    const acceptedUser: UserInfo =
      this.userService.connected_user_map.get(acceptedUserId);

    if (
      acceptedUser.userstatus === undefined ||
      acceptedUser.userstatus === UserStatus.offline ||
      acceptedUser.userstatus === UserStatus.ingame ||
      acceptedUser.userstatus === UserStatus.ingamesolo
    ) {
      // display error with snackbar
      //   return (null);
      throw new HttpException("User is not available", 408);
    }

    await this.prisma.gameInvite.updateMany({
      where: {
        receiverId: userId,
        senderId: acceptedUserId,
      },
      data: {
        acceptedInvite: true,
      },
    });

    const player: UserInfo = this.userService.connected_user_map.get(userId);
    player?.socket.emit("new-invite");
    acceptedUser?.socket.emit("new-invite");
  }

  async createMatchHistoryItem(gameInfo: GameInfo) {
    await this.prisma.matchHistoryItem.create({
      data: {
        player1Id: gameInfo.player1,
        player1Score: gameInfo.player1Score,
        player2Id: gameInfo.player2,
        player2Score: gameInfo.player2Score,
        gameMode: gameInfo.gamemode,
        winnerId: gameInfo.winnerId,
      },
    });
  }

  async getMatchHistory(userId: number) {
    let result: MatchHistoryItemDto[] = [];

    const matchHistory = await this.prisma.matchHistoryItem.findMany({
      where: {
        OR: [
          {
            player1Id: userId,
          },
          {
            player2Id: userId,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
      select: {
        winnerId: true,
        player1: {
          select: {
            id: true,
            username: true,
          },
        },
        player1Score: true,
        player2: {
          select: {
            id: true,
            username: true,
          },
        },
        player2Score: true,
        gameMode: true,
      },
    });

    if (matchHistory === undefined || matchHistory.length == 0) return result;

    matchHistory.forEach((match) => {
      result.push({
        winnerId: match.winnerId,
        p1: {
          id: match.player1.id,
          username: match.player1.username,
          userstatus: this.userService.connected_user_map.get(match.player1.id)
            ?.userstatus,
          photo: process.env.BACKEND_URL + "/user/image/" + match.player1.id,
        },
        p1Score: match.player1Score,
        p2: {
          id: match.player2.id,
          username: match.player2.username,
          userstatus: this.userService.connected_user_map.get(match.player2.id)
            ?.userstatus,
          photo: process.env.BACKEND_URL + "/user/image/" + match.player2.id,
        },
        p2Score: match.player2Score,
        gameMode: match.gameMode,
      });
    });
    return result;
  }
}

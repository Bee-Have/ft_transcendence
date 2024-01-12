import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserInfo } from "src/user/gateway/dto/userStatus.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async joinMatchmaking(userId: number) {
    const gameInvites = await this.prisma.gameInvite.findMany({
      where: {
        receiver: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (gameInvites.length > 0) {
      // remove gameInvite where the senderId is userId
      const filteredGameInvites = gameInvites.filter(
        (gameInvite) => gameInvite.senderId != userId
      );
      if (filteredGameInvites.length == 0) return userId;

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
    console.log("get user invites: ", userId);

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
}

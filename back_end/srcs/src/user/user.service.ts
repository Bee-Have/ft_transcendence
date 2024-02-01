import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import * as fs from "fs";
import { authenticator } from "otplib";
import { FriendshipService } from "src/friendship/friendship.service";
import { PrismaService } from "src/prisma/prisma.service";
import { BlockedUser } from "./dto/blocked-user.dto";
import { Friend, FriendRequest } from "./dto/friend.dto";
import { userProfileDto } from "./dto/userProfile.dto";
import { UserInfo, UserStatus } from "./gateway/dto/userStatus.dto";
import { userEditProfileDto } from "./dto/userEditProfile.dto";
import { error } from "console";
import { HttpException } from "@nestjs/common";
import { AxiosError } from "axios";
import { types } from "util";
const qrcode = require("qrcode");
var sizeOf = require("buffer-image-size");

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private friendService: FriendshipService
  ) {}

  public connected_user_map = new Map<number, UserInfo>();

  async getUserProfil(userId: number, requestedUserId: number) {
    const user = await this.getUser(requestedUserId);
    //besoin de : achievement

    const trimuser = plainToInstance(userProfileDto, user, {
      excludeExtraneousValues: true,
    });

    const friendList = await this.prisma.user.findUnique({
      where: {
        id: requestedUserId,
      },
      select: {
        friends: {
          select: {
            id: true,
          },
        },
        friendsRelation: {
          select: {
            id: true,
          },
        },
      },
    });

    trimuser.isFriend = false;
    friendList.friends.map((friend) => {
      if (friend.id === userId) trimuser.isFriend = true;
    });
    friendList.friendsRelation.map((friend) => {
      if (friend.id === userId) trimuser.isFriend = true;
    });

    return trimuser;
  }

  async getUserEditProfil(userId: number) {
    const user = await this.getUser(userId);

    const trimuser = plainToInstance(userEditProfileDto, user, {
      excludeExtraneousValues: true,
    });

    return trimuser;
  }

  async getUserIdByName(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!user) throw new NotFoundException("Username not found");

    return user.id;
  }

  async getUsername(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });

    if (!user) throw new NotFoundException("User Not Found");

    return user.username;
  }

  getUserImage(res: Response, userId: number) {
    const imagePath = process.env.AVATAR_DIRECTORY + "/" + userId + ".jpeg";

    if (!fs.existsSync(imagePath)) throw new NotFoundException();

    fs.createReadStream(imagePath).pipe(res);
  }

  async updateUsername(userId: number, username: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
        },
      });
    } catch (e) {
      throw new BadRequestException("Bad request");
    }
  }

  async updateDescription(userId: number, description: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          description,
        },
      });
    } catch (e) {
      throw new BadRequestException("Bad request");
    }
  }

  async enableTFA(userId: number): Promise<string> {
    const secret = authenticator.generateSecret(40);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFASecret: secret,
      },
    });
    return await this.generateQRCode(secret, user.realname);
  }

  async enableTFACallback(userId: number, code: string) {
    const user = await this.getUser(userId);

    const bool = authenticator.verify({
      token: code,
      secret: user.twoFASecret,
    });

    if (!bool) throw new UnprocessableEntityException("Wrong code, try again");
    else {
      await this.prisma.user.updateMany({
        where: {
          id: user.id,
        },
        data: {
          isTwoFAEnable: true,
        },
      });
    }
  }

  async disableTFA(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        isTwoFAEnable: false,
        twoFASecret: null,
      },
    });
  }

  async generateQRCode(secret: string, realname: string): Promise<string> {
    const otp = authenticator.keyuri(realname, "ft_transcendence", secret);

    try {
      const t: string = await qrcode.toDataURL(otp);
      return t;
    } catch (err) {
      throw new InternalServerErrorException(
        "Error while generating TFA QRCode"
      );
    }
  }

  async getUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException("User Not Found");

      return user;
    } catch (e: any) {
      if (e instanceof HttpException) {
        throw new BadRequestException("test1");
      }
      if (e instanceof AxiosError) {
        throw new BadRequestException("test2");
      }
    }
  }

  async getUserFriendsId(userId: number): Promise<number[]> {
    const friends = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            id: true,
          },
        },
        friendsRelation: {
          select: {
            id: true,
          },
        },
      },
    });

    const friendsWithDuplicate = friends?.friends?.concat(
      friends.friendsRelation
    );

    const unique = new Array<number>();

    friendsWithDuplicate?.forEach((obj) => {
      if (!unique.includes(obj.id) && obj.id != userId) unique.push(obj.id);
    });

    return unique;
  }

  async getUserFriends(userId: number) {
    const friendsIds = await this.getUserFriendsId(userId);

    const friends: Friend[] = new Array<Friend>();

    for (const friendId of friendsIds) {
      const friendStatus = this.connected_user_map.get(friendId)?.userstatus;

      friends.push({
        id: friendId,
        username: await this.getUsername(friendId),
        userstatus: friendStatus ? friendStatus : UserStatus.offline,
      });
    }

    return friends;
  }

  async getOrCreateConversation(memberOneId: number, memberTwoId: number) {
    const [lowestId, greaterId] =
      memberOneId < memberTwoId
        ? [memberOneId, memberTwoId]
        : [memberTwoId, memberOneId];

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        memberOneId: lowestId,
        memberTwoId: greaterId,
      },
    });

    if (conversation) return conversation;

    return await this.prisma.conversation.create({
      data: {
        memberOneId: lowestId,
        memberTwoId: greaterId,
      },
    });
  }

  async getUserPendingInvite(userId: number): Promise<FriendRequest[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        receivedFriendRequests: true,
      },
    });

    if (!user) throw new NotFoundException("User Not found");

    const friendsRequest = new Array<FriendRequest>();

    for (const friendReq of user.receivedFriendRequests) {
      const senderStatus = this.connected_user_map.get(
        friendReq.senderId
      )?.userstatus;

      if (friendReq.status === "pending") {
        friendsRequest.push({
          id: friendReq.senderId,
          userstatus: senderStatus ? senderStatus : UserStatus.offline,
          username: await this.getUsername(friendReq.senderId),
        });
      }
    }

    return friendsRequest;
  }

  async getUserSentInvite(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        sentFriendRequests: true,
      },
    });

    if (!user) throw new NotFoundException("User Not found");

    const friendsRequest = new Array<FriendRequest>();

    for (const friendReq of user.sentFriendRequests) {
      const senderStatus = this.connected_user_map.get(
        friendReq.senderId
      )?.userstatus;

      if (friendReq.status === "pending") {
        friendsRequest.push({
          id: friendReq.receiverId,
          userstatus: UserStatus.offline,
          username: await this.getUsername(friendReq.receiverId),
        });
      }
    }

    return friendsRequest;
  }

  async doMemberOneBlockedMemberTwo(memberOneId: number, memberTwoId: number) {
    const User = await this.prisma.user.findUnique({
      where: {
        id: memberOneId,
      },
      select: {
        blocked: true,
      },
    });

    if (!User) throw new Error("User not found");

    const blockedUsers = User.blocked;

    if (!blockedUsers) return false;

    for (const blockedUser of blockedUsers) {
      if (blockedUser.blockedUserId === memberTwoId) return true;
    }

    return false;
  }

  async isMemberOneBlockedByMemberTwo(
    memberOneId: number,
    memberTwoId: number
  ) {
    return this.doMemberOneBlockedMemberTwo(memberTwoId, memberOneId);
  }

  async getBlockedUser(userId: number): Promise<BlockedUser[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blocked: true,
      },
    });

    if (!user) throw new NotFoundException("User Not found");

    const blockedUser = new Array<BlockedUser>();

    for (const blocked of user.blocked) {
      const userstatus = this.connected_user_map.get(
        blocked.blockedUserId
      )?.userstatus;

      blockedUser.push({
        id: blocked.blockedUserId,
        username: await this.getUsername(blocked.blockedUserId),
        userstatus: userstatus ? userstatus : UserStatus.offline,
      });
    }

    return blockedUser;
  }

  uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file provided");

    let dimensions = null;
    try {
      dimensions = sizeOf(file.buffer);
    } catch (e) {
      throw new BadRequestException("Wrong mime type (must be jpeg)");
    }

    if (file.mimetype !== "image/jpeg" || dimensions?.type !== "jpg")
      throw new BadRequestException("Wrong mime type");
    if (file.size > 100000) throw new BadRequestException("File too large");

    if (
      dimensions.height > 700 ||
      dimensions.height < 50 ||
      dimensions.width > 700 ||
      dimensions.width < 50
    )
      throw new BadRequestException("Image dimensions are not valid");

    const filename =
      process.env.AVATAR_DIRECTORY + "/" + userId.toString() + ".jpeg";

    fs.writeFileSync(filename, file.buffer);
  }

  async fctLeaderboard() {
    const user = await this.prisma.user.findMany({
      take: 5,
      orderBy: {
        score: "desc",
      },
      select: {
        username: true,
        id: true,
        score: true,
      },
    });
    return user;
  }
}

import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserInfo(userId: number): Promise<{
        id: number;
        email: string;
        username: string;
        hashedRt: string;
    }>;
    updateUsername(userId: number, newUsername: string): Promise<void>;
}

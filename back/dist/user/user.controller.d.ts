import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    SayHello(userId: number): Promise<any>;
    updateUsername(userId: number, body: any): void;
}

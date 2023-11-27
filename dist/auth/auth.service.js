"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const url_1 = require("url");
const axios_1 = require("axios");
const ftapi_dto_1 = require("./dto/ftapi.dto");
const class_transformer_1 = require("class-transformer");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const argon2_1 = require("argon2");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    getFtAuthenticationUri() {
        const uri = this.buildFtAuthUri();
        return uri;
    }
    async authenticateUser(query) {
        const userFtToken = await this.getFtApiToken(query.code, query.state);
        const userData = await this.getUserDataFromFtApi(userFtToken);
        const user = await this.prisma.user.findUnique({
            where: {
                id: userData.id
            }
        });
        if (!user) {
            await this.prisma.user.create({
                data: {
                    id: userData.id,
                    email: userData.email,
                    username: userData.login
                },
            });
        }
        const tokens = await this.getTokens(userData.id, userData.email);
        await this.updateRtHash(userData.id, tokens.refresh_token);
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                }
            },
            data: {
                hashedRt: null
            }
        });
    }
    async refreshTokens(userId, rt) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user)
            throw new common_1.ForbiddenException('No user match');
        if (!user.hashedRt || !(await (0, argon2_1.verify)(user.hashedRt, rt)))
            throw new common_1.ForbiddenException('Invalid refresh token');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }
    async getFtApiToken(code, state) {
        if (state != process.env.FT_API_AUTH_STATE)
            throw new common_1.BadRequestException('Are you trying to hack something ? I see you 👀');
        const authCallbackUri = process.env.BACKEND_URL + process.env.AUTH_CALLBACK_URI;
        const user = await axios_1.default.postForm(process.env.FT_OAUTH_TOKEN_URL, {
            grant_type: 'authorization_code',
            client_id: process.env.FT_API_CLIENTID,
            client_secret: process.env.FT_API_SECRET,
            code: code,
            redirect_uri: authCallbackUri,
            state: process.env.FT_API_AUTH_STATE,
        })
            .catch((err) => {
            const res = {
                message: '42 Auth API returned an error for token request',
                ...err.response.data
            };
            throw new common_1.HttpException(res, err.response.status);
        });
        return user.data.access_token;
    }
    async getUserDataFromFtApi(access_token) {
        const res = await axios_1.default.get('https://api.intra.42.fr/v2/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .catch((error) => {
            if (error.response) {
                const res = {
                    message: '42 api returned an error while getting user info',
                    ...error.response.data,
                };
                throw new common_1.HttpException(res, error.response.status);
            }
            throw new common_1.HttpException('Something went wrong when requesting user infos at 42 API', common_1.HttpStatus.BAD_REQUEST);
        });
        const user_data = (0, class_transformer_1.plainToInstance)(ftapi_dto_1.FtApiUserDto, res.data, { excludeExtraneousValues: true });
        return user_data;
    }
    async getTokens(userId, email) {
        const userData = {
            sub: userId,
            email: email
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(userData, {
                secret: process.env.JWT_AT_SECRET,
                expiresIn: 60 * 60
            })
                .catch((error) => {
                console.log(error);
                throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }),
            this.jwtService.signAsync(userData, {
                secret: process.env.JWT_RT_SECRET,
                expiresIn: 60 * 60 * 7 * 24
            })
                .catch((error) => {
                console.log(error);
                throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })
        ]);
        return {
            access_token: at,
            refresh_token: rt
        };
    }
    async updateRtHash(userId, rt) {
        const hashed = await this.hashData(rt);
        await this.prisma.user.updateMany({
            where: {
                id: userId
            },
            data: {
                hashedRt: hashed
            }
        });
    }
    async hashData(data) {
        return await (0, argon2_1.hash)(data);
    }
    buildFtAuthUri() {
        const authCallbackUri = process.env.BACKEND_URL + process.env.AUTH_CALLBACK_URI;
        const paramString = new url_1.URLSearchParams('');
        paramString.append('client_id', process.env.FT_API_CLIENTID);
        paramString.append('redirect_uri', authCallbackUri);
        paramString.append('response_type', 'code');
        paramString.append('scope', 'public');
        paramString.append('state', process.env.FT_API_AUTH_STATE);
        const url = process.env.FT_OAUTH_AUTHO_URL + '?' + paramString.toString();
        return url;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
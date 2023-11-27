"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const auth_service_1 = require("./auth/auth.service");
const auth_controller_1 = require("./auth/auth.controller");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const core_1 = require("@nestjs/core");
const guards_1 = require("./common/guards");
const user_module_1 = require("./user/user.module");
const user_controller_1 = require("./user/user.controller");
const user_service_1 = require("./user/user.service");
const prisma_service_1 = require("./prisma/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot(), axios_1.HttpModule, auth_module_1.AuthModule, prisma_module_1.PrismaModule, user_module_1.UserModule],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController, user_controller_1.UserController],
        providers: [app_service_1.AppService, auth_service_1.AuthService, user_service_1.UserService, prisma_service_1.PrismaService,
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.AtGuard
            }]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
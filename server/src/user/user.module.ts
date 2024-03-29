import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/services/prisma";
import JwtService from "src/services/jwt";

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtService],
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../services/prisma";
import JwtService from "../services/jwt";
import AWS from "../services/aws";

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtService, AWS],
})
export class UserModule {}

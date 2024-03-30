import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { PrismaService } from "../services/prisma";
import { UserService } from "../user/user.service";
import AWS from "../services/aws";

@Module({
	controllers: [MessageController],
	providers: [MessageService, PrismaService, UserService, AWS],
})
export class MessageModule {}

import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { PrismaService } from "../services/prisma";
import { UserService } from "../user/user.service";

@Module({
	controllers: [MessageController],
	providers: [MessageService, PrismaService, UserService],
})
export class MessageModule {}

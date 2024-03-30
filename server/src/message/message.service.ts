import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "../services/prisma";
import { UserService } from "../user/user.service";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessageService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
	) {}

	async create(createMessageDto: CreateMessageDto): Promise<Message | string> {
		try {
			const user = await this.userService.findUser(createMessageDto.from);

			if (typeof user == "string") return user;

			const receiver = await this.userService.findUser(
				createMessageDto.to,
			);

			if (typeof receiver == "string") return receiver;

			return await this.prisma.message.create({ data: createMessageDto });
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	async findAll(email: string): Promise<Message[] | string> {
		const user = await this.userService.findUser(email);

		if (typeof user == "string") return user;

		return await this.prisma.message.findMany({
			where: { OR: [{ to: email }, { from: email }] },
		});
	}

	async findLastMessage(email: string): Promise<Message[] | string> {
		try {
			const user = await this.userService.findUser(email);
	
			if (typeof user == "string") return user;

			const messages = await this.prisma.message.findMany({
				where: {
					OR: [{ from: email }, { to: email }],
				},
				orderBy: { createdAt: "desc" },
			});

			const Messages = [];
			const lasts = [];

			for (let i = 0; i < messages.length; i++) {
				const message = messages[i];
				let found = false;

				for (let j = 0; j < lasts.length; j++) {
					const last = lasts[j];

					if (
						(last.from === message.from &&
							last.to === message.to) ||
						(last.from === message.to && last.to === message.from)
					) {
						found = true;
						break; 
					}
				}

				if (!found) {
					lasts.push({ from: message.from, to: message.to });
					Messages.push(message);
				}
			}

			return Messages;
		} catch (error) {
			return error.message;
		}
	}
}

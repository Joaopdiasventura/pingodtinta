import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "../services/prisma";
import { UserService } from "../user/user.service";

@Injectable()
export class MessageService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
	) {}

	async create(createMessageDto: CreateMessageDto): Promise<void | string> {
		try {
			const user = await this.userService.findUser(createMessageDto.from);

			if (typeof user == "string") return user;

			const receiver = await this.userService.findUser(
				createMessageDto.to,
			);

			if (typeof receiver == "string") return receiver;

			await this.prisma.message.create({ data: { ...createMessageDto } });
			return;
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	findAll() {
		return `This action returns all message`;
	}

	findOne(id: string) {
		return `This action returns a #${id} message`;
	}
}

import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	HttpStatus,
	Res,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Response } from "express";

@Controller("message")
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post()
	async create(
		@Body() createMessageDto: CreateMessageDto,
		@Res() res: Response,
	) {
		try {
			const result = await this.messageService.create(createMessageDto);

			if (result) {
				return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });
			}

			return res
				.status(HttpStatus.CREATED)
				.send({ msg: "Mensagem criada" });
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}

	@Get("/email/:email")
	findAll(@Param("email") email: string) {
		return this.messageService.findOne(email);
	}

	@Get("/time/:email")
	findOne(@Param("email") email: string) {
		return this.messageService.findOne(email);
	}
}
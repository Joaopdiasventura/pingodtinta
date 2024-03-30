import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	HttpStatus,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import AWS from "src/services/aws";

@Controller("message")
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post()
	async create(
		@Body() createMessageDto: CreateMessageDto,
		@Res() res: Response
	) {
		try {
			const result = await this.messageService.create(createMessageDto);

			if (typeof result == "string") return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

			return res
				.status(HttpStatus.CREATED)
				.send(result);
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}

	@Post("file")
	@UseInterceptors(FileInterceptor("file", AWS.multerConfig))
	async uploadArquivo(
		@Body() createMessageDto: CreateMessageDto,
		@UploadedFile() file: Express.MulterS3.File,
		@Res() res: Response,
	) {
		createMessageDto.text = `file: ${file.location}`;
		try {
			const result =
				await this.messageService.create(createMessageDto);

			if (typeof result == "string") return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

			return res.status(HttpStatus.CREATED).send(result);
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}

	@Get("/email/:email")
	async findAll(@Param("email") email: string, @Res() res: Response) {
		try {
			const result = await this.messageService.findAll(email);

			if (typeof result == "string") return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });
			
			return res
				.status(HttpStatus.OK)
				.send(result);
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}

	@Get("/last/:email")
	async findOne(@Param("email") email: string, @Res() res: Response) {
		try {
			const result = await this.messageService.findLastMessage(email);

			if (typeof result == "string") return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });
			
			return res
				.status(HttpStatus.OK)
				.send(result);
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}
}
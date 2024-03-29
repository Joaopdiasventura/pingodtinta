import * as bcrypt from "bcrypt";
import {
	Controller,
	Post,
	Body,
	Res,
	HttpStatus,
	Get,
	Param,
	UseInterceptors,
	UploadedFile,
	Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FastifyReply } from "fastify";
import Jwt from "../services/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import multerConfig from "../services/aws";
import UpdatePictureDto from "./dto/update-picture";

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwt: Jwt,
	) {}

	@Post("register")
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() res: FastifyReply,
	) {
		createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
		const result = await this.userService.create(createUserDto);

		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res
			.status(HttpStatus.CREATED)
			.send({ token: this.jwt.code(result.email) });
	}

	@Post("login")
	async login(@Body() loginUserDto: LoginUserDto, @Res() res: FastifyReply) {
		const result = await this.userService.login(loginUserDto);
		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res
			.status(HttpStatus.OK)
			.send({ token: this.jwt.code(result.email) });
	}

	@Get("/decode/:token")
	async decode(@Param("token") token: string, @Res() res: FastifyReply) {
		const email = this.jwt.decode(token);
		const result = await this.userService.findUser(email.toString());

		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res.status(HttpStatus.OK).send(result);
	}

	@Put("update")
	@UseInterceptors(FileInterceptor("file", multerConfig))
	async uploadArquivo(@Body() updatePictureDto: UpdatePictureDto, @UploadedFile() file: Express.MulterS3.File) {
		updatePictureDto.url_image = file.location;
		try {
			const result = await this.userService.updatePicture(updatePictureDto);

			if (result) {
				return result;
			}

			return "FOTO ATUALIZADA"
		} catch (error) {
			console.log(error);
			
		}
	}
}

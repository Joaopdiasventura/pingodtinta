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
import Jwt from "../services/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import UpdatePictureDto from "./dto/update-picture";
import { Response } from "express";
import AWS from "../services/aws";

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwt: Jwt,
	) {}

	@Post("register")
	async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
		createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
		const result = await this.userService.create(createUserDto);

		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res
			.status(HttpStatus.CREATED)
			.send({ token: this.jwt.code(result.email) });
	}

	@Post("login")
	async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
		const result = await this.userService.login(loginUserDto);
		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res
			.status(HttpStatus.OK)
			.send({ token: this.jwt.code(result.email) });
	}

	@Get("/decode/:token")
	async decode(@Param("token") token: string, @Res() res: Response) {
		const email = this.jwt.decode(token);
		const result = await this.userService.findUser(email.toString());

		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res.status(HttpStatus.OK).send(result);
	}

	@Get("/email/:email")
	async findUser(@Param("email") email: string, @Res() res: Response){
		const result = await this.userService.findUser(email);

		if (typeof result == "string")
			return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });

		return res.status(HttpStatus.OK).send(result);
	}

	@Put("update")
	@UseInterceptors(FileInterceptor("file", AWS.multerConfig))
	async uploadArquivo(
		@Body() updatePictureDto: UpdatePictureDto,
		@UploadedFile() file: Express.MulterS3.File,
		@Res() res: Response,
	) {
		updatePictureDto.url_image = file.location;
		try {
			const result =
				await this.userService.updatePicture(updatePictureDto);

			if (result) {
				return res.status(HttpStatus.BAD_REQUEST).send({ msg: result });
			}

			return res.status(HttpStatus.OK).send({ msg: "Foto Atualizada" });
		} catch (error) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.send({ msg: error.message });
		}
	}
}

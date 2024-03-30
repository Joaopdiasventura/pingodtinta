import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../services/prisma";
import { User } from "./entities/user.entity";
import { LoginUserDto } from "./dto/login-user.dto";
import UpdatePictureDto from "./dto/update-picture";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findUser(email: string): Promise<User | string> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email },
			});

			if (!user) return "Usuário não encontrado";

			return user;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
	async create(createUserDto: CreateUserDto): Promise<User | string> {
		try {
			const existUser = await this.findUser(createUserDto.email);
			if (typeof existUser != "string")
				return "Já existe um usuário cadastrado com esse email";

			const user = await this.prisma.user.create({
				data: {
					...createUserDto,
				},
			});

			return user;
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	async login(loginUserDto: LoginUserDto): Promise<User | string> {
		const user = await this.findUser(loginUserDto.email);
		if (typeof user == "string") return user;

		if (bcrypt.compare(user.password, loginUserDto.password)) return user;

		return "Senha incorreta";
	}

	async updatePicture(updatePictureDto: UpdatePictureDto) {
		const user = await this.findUser(updatePictureDto.email);
		if (typeof user == "string") return user;

		await this.prisma.user.update({
			where: { email: updatePictureDto.email },
			data: { picture: updatePictureDto.url_image },
		});
		return;
	}
}

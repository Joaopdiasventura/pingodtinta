import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import Jwt from "../services/jwt";
import { PrismaService } from "../services/prisma";

describe("UserController", () => {
	let controller: UserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService, Jwt, PrismaService],
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});

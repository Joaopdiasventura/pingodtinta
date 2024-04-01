import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { MessageModule } from "./message/message.module";
import { FileModule } from './file/file.module';

@Module({
	imports: [UserModule, MessageModule, FileModule],
	controllers: [],
	providers: [],
})
export class AppModule {}

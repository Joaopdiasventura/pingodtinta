import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import * as multerS3 from "multer-s3";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const s3Config = new S3Client({
	region: process.env.AWS_DEFAULT_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

@Injectable()
export default class AWS {
	static multerConfig = {
		storage: multerS3({
			s3: s3Config,
			bucket: "cartesian-space",
			contentType: multerS3.AUTO_CONTENT_TYPE,
			acl: "public-read",
			key: (req, file, cb) => {
				const fileName =
					path.parse(file.originalname).name.replace(/\s/g, "") +
					"-" +
					uuidv4();

				const extension = path.parse(file.originalname).ext;
				cb(null, `${fileName}${extension}`);
			},
		}),
	};
}

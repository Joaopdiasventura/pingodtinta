import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export default class Jwt {
    code(param: any){
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(param, secretKey);
        return token;
    }

    decode(token: string){
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    }
}
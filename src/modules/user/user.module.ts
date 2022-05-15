import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "../../database/repositories/user.repository";
import { User, UserSchema } from "../../database/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { PostModule } from "../post/post.module";
import { PostRepository } from "src/database/repositories/post.repository";


@Module({

    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({
        secret: 'secret',
        signOptions: {
            expiresIn: 3600
        }
    }),
    forwardRef(() => PostModule)
    ],
    providers: [UserService, UserRepository, JwtStrategy],
    controllers: [UserController],
    exports: [JwtStrategy, PassportModule, UserRepository]
})
export class UserModule { }
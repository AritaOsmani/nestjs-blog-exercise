import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostRepository } from "../../database/repositories/post.repository";
import { PostClass, PostSchema } from "../../database/entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { UserModule } from "../user/user.module";
import { UserRepository } from "src/database/repositories/user.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: PostClass.name, schema: PostSchema }]),
    forwardRef(() => UserModule)
    ],
    providers: [PostService, PostRepository],
    controllers: [PostController],
    exports: [PostRepository]
})
export class PostModule { }
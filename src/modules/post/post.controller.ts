import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PostClass } from "../../database/entities/post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostService } from "./post.service";


@Controller('posts')

export class PostController {
    constructor(private postService: PostService) { }

    @Post('/create')
    @UseGuards(AuthGuard())
    async createPost(@Req() request, @Body() createPostDto: CreatePostDto): Promise<PostClass> {
        return await this.postService.createPost(createPostDto, request.user.id)
    }

    @Get()
    @UseGuards(AuthGuard())
    async getAllPosts(@Req() request): Promise<PostClass[]> {
        return await this.postService.getAllUserPosts(request.user.id)
    }

    @Get('/all')
    @UseGuards(AuthGuard())
    async getPosts(@Req() request): Promise<PostClass[]> {
        //not working as intended
        if (request) {
            return await this.postService.getOthersPosts(request.user.id)
        } else {
            return await this.postService.getAllPosts()
        }
    }
}
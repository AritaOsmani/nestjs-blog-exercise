import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PostClass } from "../../database/entities/post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { CheckIdPipe } from "./pipes/checkId.pipe";
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

    @Get('/like/:id')
    @UseGuards(AuthGuard())
    async likePost(@Req() req, @Param('id', CheckIdPipe) id: string): Promise<PostClass> {
        return await this.postService.likePost(req.user.id, id)
    }

    @Get('/dislike/:id')
    @UseGuards(AuthGuard())
    async dislikePost(@Req() req, @Param('id', CheckIdPipe) id: string): Promise<PostClass> {
        return await this.postService.dislikePost(req.user.id, id)
    }
}
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PostClass } from "../../database/entities/post.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { CheckIdPipe } from "./pipes/checkId.pipe";
import { PostService } from "./post.service";


@Controller('posts')
@UseGuards(AuthGuard())
export class PostController {
    constructor(private postService: PostService) { }

    @Post('/create')
    async createPost(@Req() request, @Body() createPostDto: CreatePostDto): Promise<PostClass> {
        return await this.postService.createPost(createPostDto, request.user.id)
    }

    @Get()
    async getAllPosts(@Req() request): Promise<PostClass[]> {
        return await this.postService.getAllUserPosts(request.user.id)
    }

    @Get('/all')
    async getPosts(@Req() request): Promise<PostClass[]> {
        //not working as intended
        if (request) {
            return await this.postService.getOthersPosts(request.user.id)
        } else {
            return await this.postService.getAllPosts()
        }
    }

    @Get('/like/:id')
    async likePost(@Req() req, @Param('id', CheckIdPipe) id: string): Promise<PostClass> {
        return await this.postService.likePost(req.user.id, id)
    }

    @Get('/dislike/:id')
    async dislikePost(@Req() req, @Param('id', CheckIdPipe) id: string): Promise<PostClass> {
        return await this.postService.dislikePost(req.user.id, id)
    }

    @Post('/comment/:id')
    async createComment(@Body() content: CreateCommentDto, @Param('id', CheckIdPipe) id: string, @Req() req): Promise<PostClass> {
        return await this.postService.createComment(content, req.user.id, id)
    }

    @Delete('/comment/delete/:postId')
    async deleteComment(@Param('postId', CheckIdPipe) postId: string, @Req() req): Promise<PostClass> {
        return await this.postService.deleteComment(req.user.id, postId)
    }

    @Delete('/delete/:postId')
    async deletePost(@Param('postId', CheckIdPipe) postId: string, @Req() req): Promise<void> {
        return await this.postService.deletePost(postId, req.user.id)
    }

    @Patch('/update/:postId')
    async updatePost(@Param('postId', CheckIdPipe) postId: string, @Body() updatePostDto: UpdatePostDto, @Req() req): Promise<PostClass> {
        return await this.postService.updatePost(postId, req.user.id, updatePostDto)
    }
}
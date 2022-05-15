import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FollowUserDto } from "./dto/follow-user.dto";
import { LikeDto } from "./dto/like-post.dto";
import { SignInCredentialsDto } from "./dto/signIn-credentials.dto";
import { AccessTokenInterface } from "./interfaces/accessToken.interface";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private userServise: UserService) { }

    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<string> {
        return await this.userServise.signUp(createUserDto)
    }

    @Post('/signin')
    async signIn(@Body() signInCredentials: SignInCredentialsDto): Promise<AccessTokenInterface> {
        return await this.userServise.signIn(signInCredentials)
    }

    @Get()
    @UseGuards(AuthGuard())
    async getAllUsers(): Promise<User[]> {
        return await this.userServise.getAllUsers()
    }

    @Get('/user')
    @UseGuards(AuthGuard())
    async getUser(@Req() req): Promise<User> {
        return await this.userServise.getUserByUsername(req.user.username)
    }

    @Post('/follow')
    @UseGuards(AuthGuard())
    async followUser(@Req() req, @Body() followUser: FollowUserDto) {
        return await this.userServise.followUser(req.user.id, followUser.followingId)
    }

    //Not working, strictPopulate required somewhere
    @Post('/like')
    @UseGuards(AuthGuard())
    async likePost(@Body() likeDto: LikeDto, @Req() request): Promise<User> {
        return await this.userServise.likePost(likeDto, request.user.id)
    }

}
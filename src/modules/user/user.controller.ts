import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../database/entities/user.entity";
import { CheckIdPipe } from "../post/pipes/checkId.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { FollowUserDto } from "./dto/follow-user.dto";
import { LikeDto } from "./dto/like-post.dto";
import { SignInCredentialsDto } from "./dto/signIn-credentials.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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

    @Delete('/delete')
    @UseGuards(AuthGuard())
    async deleteAccount(@Req() req): Promise<string> {
        return await this.userServise.deleteAccount(req.user.id)
    }

    @Patch('/update')
    @UseGuards(AuthGuard())
    async updateAccount(@Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {
        return await this.userServise.updateAccount(req.user.id, updateUserDto)
    }

}
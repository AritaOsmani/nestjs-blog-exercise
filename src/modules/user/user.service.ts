import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "../../database/entities/user.entity";
import { UserRepository } from "../../database/repositories/user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { SignInCredentialsDto } from "./dto/signIn-credentials.dto";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadInterface } from "./interfaces/jwt-payload.interface";
import { AccessTokenInterface } from "./interfaces/accessToken.interface";
import { LikeDto } from "./dto/like-post.dto";
import { PostRepository } from "src/database/repositories/post.repository";

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService,
        private postRepository: PostRepository) { }

    async signUp(createUserDto: CreateUserDto): Promise<string> {
        const newUser = await this.userRepository.createUser(createUserDto)
        if (newUser) {
            return 'User created sucessfully'
        } else {
            throw new ConflictException('Something went wrong!')
        }
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.getAll()
    }

    async signIn(signInCredentials: SignInCredentialsDto): Promise<AccessTokenInterface> {
        const { email, password } = signInCredentials
        const match = await this.userRepository.getByEmail(email)
        if (match && bcrypt.compare(password, match.password)) {
            const payload: JwtPayloadInterface = { email }
            const accessToken = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('Please check your sign in credentials.')
        }
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userRepository.getByUsername(username)
        if (user) {
            return user
        } else {
            throw new UnauthorizedException('You\'re not authorized to view this user')
        }
    }

    async followUser(userId: string, followingId: string): Promise<User> {
        const checkUser = await this.userRepository.getUserById(userId)
        const checkFollowing = await this.userRepository.getUserById(followingId)
        if (checkUser && checkFollowing) {
            return await this.userRepository.follow(userId, followingId)
        } else {
            throw new NotFoundException('Ids provided are invalid')
        }
    }

    async likePost(likeDto: LikeDto, userId: string): Promise<User> {
        //check if user exists:
        const userMatch = (await this.userRepository.getUserById(userId)).populate('like')
        if (userMatch) {
            //check if post exists:
            const postExists = await this.postRepository.getPostById(likeDto.post)
            if (postExists) {
                const likes = (await userMatch).likes
                console.log('likes: ', likes)
                return await this.userRepository.likePost(likeDto, userId)
            } else {
                throw new NotFoundException(`Post with given id: ${likeDto.post} not found!`)
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }
}
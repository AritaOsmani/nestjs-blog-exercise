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
import { UpdateUserDto } from "./dto/update-user.dto";

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
        if (match && await bcrypt.compare(password, match.password)) {
            console.log('bcrypt compare: ', bcrypt.compare(password, match.password))
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

    async deleteAccount(userId: string): Promise<string> {
        //check user
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            const deleted = await this.userRepository.deleteAccount(userId)
            if (deleted.deletedCount !== 0) {
                return 'Account deleted sucessfully!'
            } else {
                return 'Something went wrong!'
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not signed in!`)
        }
    }

    async updateAccount(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        //check user:
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            if (updateUserDto.username) {
                //check if this username already is being used:
                const userFound = await this.userRepository.getByUsername(updateUserDto.username)
                if (userFound) {
                    throw new ConflictException(`This username is already being used!`)
                }
            }
            if (updateUserDto.email) {
                //check if this email is being used:
                const userFound = await this.userRepository.getByEmail(updateUserDto.email)
                if (userFound) {
                    throw new ConflictException(`This email is already being used!`)
                }
            }

            if (updateUserDto.password) {
                const salt = await bcrypt.genSalt()
                const hashed = await bcrypt.hash(updateUserDto.password, salt)
                updateUserDto.password = hashed
            }
            return await this.userRepository.updateAccount(userId, updateUserDto)

        } else {
            throw new NotFoundException(`User with given id: ${userId} not signed in!`)
        }
    }
}
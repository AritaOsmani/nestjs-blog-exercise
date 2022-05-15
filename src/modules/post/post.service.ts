import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "src/database/repositories/user.repository";
import { PostClass } from "../../database/entities/post.entity";
import { PostRepository } from "../../database/repositories/post.repository";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
    constructor(private postRepository: PostRepository,
        private userRepository: UserRepository) { }

    async createPost(createPostDto: CreatePostDto, userId: string): Promise<PostClass> {
        //check if the user with given id exists:
        const userFound = await this.userRepository.getUserById(userId)
        if (userFound) {
            const newPost = await this.postRepository.create(createPostDto, userId)
            if (newPost) {
                return newPost
            } else {
                throw new ConflictException('Something went wrong! The post has not been created.')
            }
        } else {
            throw new NotFoundException(`User with id ${userId} not found!`)
        }

    }

    async getAllUserPosts(userId: string): Promise<PostClass[]> {
        const match = await this.userRepository.getUserById(userId)
        if (match) {
            return await this.postRepository.getUserPosts(userId)
        } else {
            throw new NotFoundException(`User with given id ${userId} not found!`)
        }
    }

    async getAllPosts(): Promise<PostClass[]> {
        return await this.postRepository.getAllPosts()
    }

    async getOthersPosts(userId: string): Promise<PostClass[]> {
        const matchUser = await this.userRepository.getUserById(userId)
        if (matchUser) {
            return await this.postRepository.getOthersPosts(userId)
        } else {
            throw new NotFoundException(`User with given id ${userId} not found!`)
        }
    }
}
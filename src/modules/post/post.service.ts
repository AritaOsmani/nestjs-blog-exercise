import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/database/repositories/user.repository";
import { PostClass } from "../../database/entities/post.entity";
import { PostRepository } from "../../database/repositories/post.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

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

    async likePost(userId: string, postId: string): Promise<PostClass> {
        //check the user id:
        const userMatch = await this.userRepository.getUserById(userId)

        if (userMatch) {
            //check the post id:
            const postMatch = await this.postRepository.getPostById(postId)

            if (postMatch) {
                //check if the post belongs to this user:
                if (postMatch.user[0].toString() === userMatch._id.toString()) {

                    throw new ConflictException(`You can't like your own post!`)
                }

                return await this.postRepository.likePost(userId, postId)
            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }

        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

    async dislikePost(userId: string, postId: string): Promise<PostClass> {
        //check the user
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            //check the post
            const postMatch = await this.postRepository.getPostById(postId)
            if (postMatch) {
                return await this.postRepository.dislikePost(userId, postId)

            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }

        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

    async createComment(content: CreateCommentDto, userId: string, postId: string): Promise<PostClass> {
        //check user:
        const matchedUser = await this.userRepository.getUserById(userId)

        if (matchedUser) {
            //check post id:
            const postMatch = await this.postRepository.getPostById(postId)
            if (postMatch) {
                return await this.postRepository.createComment(content, userId, postId)

            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

    async deleteComment(userId: string, postId: string): Promise<PostClass> {
        //check the user
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            //check post
            const postMatch = await this.postRepository.getPostById(postId)
            if (postMatch) {
                return await this.postRepository.deleteComment(userId, postId)
            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

    async deletePost(postId, userId): Promise<void> {
        //check user:
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            //check post:
            const postMatch = await this.postRepository.getPostById(postId)
            if (postMatch) {
                //check if the post belongs to the user:
                if (postMatch.user.toString() !== userMatch._id.toString()) {
                    throw new UnauthorizedException(`You are not authorized to delete this post!`)
                }
                return await this.postRepository.deletePost(postId, userId)
            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

    async updatePost(postId: string, userId: string, updatePostDto: UpdatePostDto): Promise<PostClass> {
        //check user:
        const userMatch = await this.userRepository.getUserById(userId)
        if (userMatch) {
            //check post:
            const postMatch = await this.postRepository.getPostById(postId)
            if (postMatch) {
                //check if the post belongs to this user:
                if (postMatch.user.toString() !== userMatch._id.toString()) {
                    throw new UnauthorizedException(`You're not authorized to update this post.`)
                }
                return await this.postRepository.updatePost(postId, userId, updatePostDto)
            } else {
                throw new NotFoundException(`Post with given id:${postId} not found!`)
            }
        } else {
            throw new NotFoundException(`User with given id: ${userId} not found!`)
        }
    }

}
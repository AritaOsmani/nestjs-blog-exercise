import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "../../modules/post/dto/create-comment.dto";
import { UpdatePostDto } from "../../modules/post/dto/update-post.dto";
import { CreatePostDto } from "../../modules/post/dto/create-post.dto";
import { PostClass } from "../entities/post.entity";

@Injectable()
export class PostRepository {
    constructor(@InjectModel(PostClass.name) private postModel: Model<PostClass>) { }

    async create(createPostDto: CreatePostDto, userId: string): Promise<PostClass> {
        const { title, content } = createPostDto
        const newPost = new this.postModel({ title, content, user: userId })
        try {
            return await newPost.save()
        } catch (err) {
            console.log(err)
        }
    }

    async getUserPosts(userId: string): Promise<PostClass[]> {
        return await this.postModel.find({ user: userId }).populate('user')
    }

    async getAllPosts(): Promise<PostClass[]> {
        return await this.postModel.find().populate('user')
    }

    async getOthersPosts(userId: string): Promise<PostClass[]> {
        return await this.postModel.find({ $nor: [{ user: userId }] }).populate('user')
    }

    async getPostById(id: string): Promise<PostClass> {
        return await this.postModel.findById({ _id: id })
    }

    async likePost(userId: string, postId: string): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $push: { likes: { user: userId } } })

        return await this.postModel.findById({ _id: postId })
            .populate({
                path: 'likes',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
    }

    async dislikePost(userId: string, postId: string): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $pull: { likes: { user: userId } } })
        console.log('updated: ', updated)
        return await this.postModel.findById({ _id: postId })
            .populate({
                path: 'likes',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
    }

    async createComment(contentDto: CreateCommentDto, userId: string, postId: string): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $addToSet: { comments: { content: contentDto.content, user: userId } } })
        return await this.postModel.findById({ _id: postId })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
    }

    //Deletes all comments that fulfill this condition-- the comments need to have an id
    async deleteComment(userId, postId): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $pull: { comments: { user: userId } } })
        return await this.postModel.findById({ _id: postId })
    }

    async deletePost(postId: string, userId: string): Promise<void> {
        try {
            const deleted = await this.postModel.deleteOne({ $and: [{ _id: postId }, { user: userId }] })
            console.log('deleted: ', deleted)
        } catch (err) {
            console.log(err)
        }

    }

    async updatePost(postId: string, userId: string, updatePostDto: UpdatePostDto): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $set: { title: updatePostDto.title, content: updatePostDto.content } }).setOptions({ returnDocument: 'after' })
        console.log('updated: ', updated)
        return await this.postModel.findById({ _id: postId })
    }
}
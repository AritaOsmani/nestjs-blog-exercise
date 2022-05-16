import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostDto } from "../../modules/post/dto/create-post.dto";
import { LikeDto } from "../../modules/user/dto/like-post.dto";
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
        const updated = await this.postModel.updateOne({ _id: postId }, { $addToSet: { likes: { user: userId } } })
        return await this.postModel.findById({ _id: postId })
    }

    async dislikePost(userId: string, postId: string): Promise<PostClass> {
        const updated = await this.postModel.updateOne({ _id: postId }, { $pull: { likes: { user: userId } } })
        console.log('updated: ', updated)
        const likes = await (await this.postModel.findById({ _id: postId })).likes
        // likes.map(like => {
        //     console.log('like: ', like.user)
        //     console.log(typeof like)
        // })
        console.log('userId: ', userId)
        console.log('likes[0]: ', likes)
        //  console.log('equals? ', (userId === likes[0].user))
        console.log('likes: ', likes)
        return await this.postModel.findById({ _id: postId })
    }
}
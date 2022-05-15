import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePostDto } from "src/modules/post/dto/create-post.dto";
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
}
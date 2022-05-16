import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt'
import { LikeDto } from "src/modules/user/dto/like-post.dto";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getUserById(id: string): Promise<User> {
        return await this.userModel.findById({ _id: id }).populate('follows')
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password } = createUserDto
        const salt = await bcrypt.genSalt()
        console.log('salt: ', salt)
        const hashed = await bcrypt.hash(password, salt)
        console.log('hashed: ', hashed)
        const newUser = new this.userModel({ username, email, password: hashed })
        try {
            return await newUser.save()
        } catch (err) {
            console.log(err)
        }

    }

    async getAll(): Promise<User[]> {
        return await this.userModel.find({}, { password: 0 })
    }

    async getByUsername(username: string): Promise<User> {
        return await this.userModel.findOne({ username })
    }
    async getByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email })
    }

    async follow(userId: string, followingId: string): Promise<User> {
        const userToUpdate = await this.userModel.updateOne({ _id: userId }, { $addToSet: { follows: followingId } })
        return await this.userModel.findById({ _id: userId }).populate('follows')
    }


}